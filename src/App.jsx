import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Download, Trash2, Plus, X, Mail, Zap, Shield, ArrowRight, CheckCircle, LogOut, User, FileText, AlertCircle, Check, Info, Edit2, Settings, Eye, EyeOff, Columns } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from './lib/supabase';

// Footer Component
const Footer = ({ variant = 'light' }) => {
  const isDark = variant === 'dark';

  return (
    <footer className={`py-8 mt-auto ${isDark ? 'bg-black/20' : 'bg-gray-100 border-t border-gray-200'}`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          {/* Brand */}
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            © {new Date().getFullYear()} CSV Cleaner. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/privacy"
              className={`text-sm transition ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className={`text-sm transition ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Terms of Service
            </Link>
            <Link
              to="/acceptable-use"
              className={`text-sm transition ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Acceptable Use
            </Link>
            <Link
              to="/cookies"
              className={`text-sm transition ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Cookie Policy
            </Link>
          </div>

          {/* Security Badge */}
          <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <Shield className="w-4 h-4" />
            <span>Secure & GDPR Compliant</span>
          </div>
        </div>

        {/* Contact Section */}
        <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-200'} pt-6`}>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Need help or have questions?
            </span>
            <a
              href="mailto:contact@holysmokas.com"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${isDark
                  ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
            >
              <Mail className="w-4 h-4" />
              contact@holysmokas.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================
const SECURITY_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_ROWS: 50000, // Maximum rows per file
  MAX_FILES: 20, // Maximum files per session
  MAX_CELL_LENGTH: 1000, // Maximum characters per cell
  ALLOWED_EXTENSIONS: ['.csv', '.xlsx', '.xls'],
  DANGEROUS_FORMULA_PREFIXES: ['=', '+', '-', '@', '\t', '\r'],
  SUSPICIOUS_PATTERNS: [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /vbscript:/i,
    /data:/i,
  ],
  SUSPICIOUS_EMAIL_PATTERNS: [
    /javascript:/i,
    /<script/i,
    /\bexec\b/i,
    /\beval\b/i,
    /<[^>]+>/i, // HTML tags in email
  ]
};

// ============================================================================
// SECURITY FUNCTIONS
// ============================================================================

/**
 * Sanitize a cell value to prevent CSV injection and XSS attacks
 * @param {any} value - The cell value to sanitize
 * @returns {string} - Sanitized string value
 */
const sanitizeCell = (value) => {
  if (value === null || value === undefined) return '';

  let sanitized = String(value).trim();

  // Remove null bytes (path traversal attempt)
  sanitized = sanitized.replace(/\0/g, '');

  // Check for CSV injection (formulas) - prefix with single quote to neutralize
  if (SECURITY_CONFIG.DANGEROUS_FORMULA_PREFIXES.some(prefix => sanitized.startsWith(prefix))) {
    sanitized = "'" + sanitized;
  }

  // Truncate to max length
  if (sanitized.length > SECURITY_CONFIG.MAX_CELL_LENGTH) {
    sanitized = sanitized.substring(0, SECURITY_CONFIG.MAX_CELL_LENGTH);
  }

  // Remove potentially dangerous HTML/Script content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^>]*>/gi, '');

  return sanitized;
};

/**
 * Validate an email address for format and security
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid and safe
 */
const validateEmail = (email) => {
  if (!email) return false;

  const emailStr = String(email).trim().toLowerCase();

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailStr)) return false;

  // Check for suspicious patterns that could indicate injection attempts
  for (const pattern of SECURITY_CONFIG.SUSPICIOUS_EMAIL_PATTERNS) {
    if (pattern.test(emailStr)) return false;
  }

  // Check for excessively long emails (potential buffer overflow attempt)
  if (emailStr.length > 254) return false;

  return true;
};

/**
 * Validate file before processing
 * @param {File} file - The file to validate
 * @returns {object} - { valid: boolean, reason?: string }
 */
const validateFile = (file) => {
  // Check file size
  if (file.size > SECURITY_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      reason: `File size exceeds ${SECURITY_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB limit`
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = SECURITY_CONFIG.ALLOWED_EXTENSIONS.some(ext =>
    fileName.endsWith(ext)
  );

  if (!hasValidExtension) {
    return {
      valid: false,
      reason: 'Invalid file type. Only CSV and Excel files (.csv, .xlsx, .xls) are allowed'
    };
  }

  // Check for null bytes in filename (path traversal attempt)
  if (file.name.includes('\0')) {
    return {
      valid: false,
      reason: 'Invalid filename detected'
    };
  }

  // Check for directory traversal attempts in filename
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return {
      valid: false,
      reason: 'Invalid filename detected'
    };
  }

  return { valid: true };
};

/**
 * Validate file content for malicious patterns
 * @param {array} data - The parsed file data
 * @returns {object} - { valid: boolean, reason?: string }
 */
const validateFileContent = (data) => {
  // Check row limit
  if (data.length > SECURITY_CONFIG.MAX_ROWS) {
    return {
      valid: false,
      reason: `File exceeds maximum row limit of ${SECURITY_CONFIG.MAX_ROWS.toLocaleString()} rows`
    };
  }

  // Sample check for suspicious patterns (check first 100 rows for performance)
  const sampleSize = Math.min(data.length, 100);
  for (let i = 0; i < sampleSize; i++) {
    const row = data[i];
    if (!row) continue;

    const rowString = JSON.stringify(row);
    for (const pattern of SECURITY_CONFIG.SUSPICIOUS_PATTERNS) {
      if (pattern.test(rowString)) {
        return {
          valid: false,
          reason: 'File contains potentially malicious content'
        };
      }
    }
  }

  return { valid: true };
};

/**
 * Extract potential name from email address
 * @param {string} email - The email address to parse
 * @returns {object} - { firstName, lastName, fullName }
 */
const extractNameFromEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { firstName: '', lastName: '', fullName: '' };
  }

  // Get the part before @
  const localPart = email.split('@')[0];
  if (!localPart) {
    return { firstName: '', lastName: '', fullName: '' };
  }

  // Clean up the local part - remove numbers at the end (like john.doe123)
  let cleaned = localPart.replace(/\d+$/, '');

  // Skip if it looks like a generic/business email
  const genericPatterns = [
    /^(info|contact|support|admin|sales|hello|help|service|noreply|no-reply|mail|email|office|team|hr|marketing|billing)$/i,
    /^[a-z]{1,2}\d+$/i, // like "a1", "ab123"
  ];

  if (genericPatterns.some(pattern => pattern.test(cleaned))) {
    return { firstName: '', lastName: '', fullName: '' };
  }

  let parts = [];

  // Try different separators: dot, underscore, hyphen
  if (cleaned.includes('.')) {
    parts = cleaned.split('.');
  } else if (cleaned.includes('_')) {
    parts = cleaned.split('_');
  } else if (cleaned.includes('-')) {
    parts = cleaned.split('-');
  } else {
    // Try to detect camelCase or concatenated names (johnsmith -> John Smith)
    // Look for common first names at the start
    const commonFirstNames = [
      'james', 'john', 'robert', 'michael', 'david', 'william', 'richard', 'joseph', 'thomas', 'charles',
      'mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan', 'jessica', 'sarah', 'karen',
      'daniel', 'matthew', 'anthony', 'mark', 'donald', 'steven', 'paul', 'andrew', 'joshua', 'kenneth',
      'nancy', 'betty', 'margaret', 'sandra', 'ashley', 'kimberly', 'emily', 'donna', 'michelle', 'dorothy',
      'alex', 'alexis', 'anna', 'anna', 'chris', 'christopher', 'christine', 'eric', 'erik', 'jason',
      'brian', 'kevin', 'ryan', 'justin', 'brandon', 'jacob', 'nicholas', 'tyler', 'aaron', 'adam',
      'amanda', 'melissa', 'stephanie', 'nicole', 'heather', 'rachel', 'samantha', 'katherine', 'christine', 'deborah',
      'alyssa', 'valentino', 'yeliz', 'shima', 'shira', 'troy', 'gonzalez', 'karen'
    ];

    const lowerCleaned = cleaned.toLowerCase();
    let matchedFirstName = null;

    for (const firstName of commonFirstNames) {
      if (lowerCleaned.startsWith(firstName) && lowerCleaned.length > firstName.length) {
        matchedFirstName = firstName;
        break;
      }
    }

    if (matchedFirstName) {
      parts = [matchedFirstName, cleaned.substring(matchedFirstName.length)];
    } else {
      // Can't split it reliably, just use as single name
      parts = [cleaned];
    }
  }

  // Filter out empty parts and very short parts (likely initials we can't interpret)
  parts = parts.filter(p => p && p.length > 1);

  if (parts.length === 0) {
    return { firstName: '', lastName: '', fullName: '' };
  }

  // Capitalize each part properly
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const firstName = capitalize(parts[0]);
  const lastName = parts.length > 1 ? parts.slice(1).map(capitalize).join(' ') : '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  return { firstName, lastName, fullName };
};

/**
 * Sanitize a filename to prevent path traversal and other attacks
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename
 */
const sanitizeFilename = (filename) => {
  if (!filename) return 'unnamed_file';

  let sanitized = String(filename);

  // Remove directory traversal attempts
  sanitized = sanitized.replace(/\.\./g, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove path separators
  sanitized = sanitized.replace(/[\/\\]/g, '');

  // Keep only safe characters (alphanumeric, dots, underscores, hyphens)
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Ensure it doesn't start with a dot (hidden file)
  if (sanitized.startsWith('.')) {
    sanitized = '_' + sanitized.substring(1);
  }

  // Ensure reasonable length
  if (sanitized.length > 200) {
    const ext = sanitized.split('.').pop();
    sanitized = sanitized.substring(0, 195) + '.' + ext;
  }

  return sanitized || 'unnamed_file';
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const EmailListCleaner = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // App state
  const [showApp, setShowApp] = useState(false);
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paid, setPaid] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState([]);

  // File rename state
  const [showFileRename, setShowFileRename] = useState(false);
  const [fileRenames, setFileRenames] = useState({});

  // Column management state
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [editingColumn, setEditingColumn] = useState(null); // { fileId, columnId, currentLabel }

  // Add notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Check for existing session on mount
  useEffect(() => {
    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email.split('@')[0]
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    // Check for payment success - restore files and verify payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      const sessionId = urlParams.get('session_id');
      console.log('Payment success detected, session:', sessionId);

      // Restore files from localStorage first
      let restoredFiles = [];
      try {
        const savedFiles = localStorage.getItem('csv_cleaner_files');
        console.log('Saved files from localStorage:', savedFiles ? 'found' : 'not found');
        if (savedFiles) {
          restoredFiles = JSON.parse(savedFiles);
          console.log('Restored files count:', restoredFiles.length);
          setFiles(restoredFiles);
          setShowApp(true);
          if (restoredFiles.length > 0) {
            setActiveTab(restoredFiles[0].id);
          }
        }
      } catch (e) {
        console.error('Error restoring files:', e);
      }

      // Verify payment and trigger download
      verifyPaymentAndDownload(sessionId, restoredFiles);
    }

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.name || session.user.email.split('@')[0]
      });
      setIsAuthenticated(true);
    }
  };

  // Auth functions
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: {
            emailRedirectTo: `${window.location.origin}`,
            data: {
              name: authForm.name
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          if (data.user.identities?.length === 0) {
            setAuthError('This email is already registered. Please sign in instead.');
          } else {
            // Notify about new signup (email + Google Sheets)
            try {
              await fetch('/api/user-signup-webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: authForm.name,
                  email: authForm.email,
                  timestamp: new Date().toISOString()
                })
              });
            } catch (webhookError) {
              // Don't block signup if webhook fails
              console.error('Signup webhook error:', webhookError);
            }

            addNotification('Registration successful! Please check your email to confirm your account.', 'success');
            setAuthMode('login');
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password
        });

        if (error) throw error;

        setShowAuth(false);
        setAuthForm({ email: '', password: '', name: '' });
        addNotification('Welcome back!', 'success');
      }
    } catch (error) {
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowApp(false);
    setFiles([]);
    setActiveTab(null);
    setPaid(false);
    addNotification('Logged out successfully', 'info');
  };

  // File processing functions with security
  const processData = (rawData) => {
    if (rawData.length === 0) return { data: [], stats: { total: 0, valid: 0, invalid: 0, duplicates: 0, sanitized: 0 } };

    const headers = rawData[0].map(h => sanitizeCell(h).toLowerCase());
    const rows = rawData.slice(1);

    const processed = [];
    const seenEmails = new Set();

    // Security statistics
    let invalidEmails = 0;
    let duplicates = 0;
    let sanitizedCells = 0;
    let namesExtracted = 0;

    rows.forEach(row => {
      const rowData = {};
      headers.forEach((header, index) => {
        const rawValue = row[index];
        const sanitizedValue = sanitizeCell(rawValue);

        // Track sanitization
        if (rawValue && String(rawValue) !== sanitizedValue) {
          sanitizedCells++;
        }

        rowData[header] = sanitizedValue;
      });

      let email = findEmail(rowData, headers);
      let firstName = findFirstName(rowData, headers);
      let lastName = findLastName(rowData, headers);
      let company = findCompany(rowData, headers);
      let name = findName(rowData, headers);

      if (!email) return;

      email = sanitizeCell(email).toLowerCase().trim();

      // Security: Validate email
      if (!validateEmail(email)) {
        invalidEmails++;
        return;
      }

      // Check for duplicates
      if (seenEmails.has(email)) {
        duplicates++;
        return;
      }
      seenEmails.add(email);

      if (name && !firstName && !lastName) {
        const parts = String(name).trim().split(/\s+/);
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
      }

      // If we still don't have name data, try to extract from email
      if (!firstName && !lastName && !name) {
        const extracted = extractNameFromEmail(email);
        if (extracted.fullName) {
          firstName = extracted.firstName;
          lastName = extracted.lastName;
          name = extracted.fullName;
          namesExtracted++;
        }
      }

      processed.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: sanitizeCell(name || `${firstName} ${lastName}`.trim()) || '',
        email_only: email,
        first_name: sanitizeCell(firstName) || '',
        last_name: sanitizeCell(lastName) || '',
        email: email,
        company: sanitizeCell(company) || ''
      });
    });

    // Log security actions (for debugging)
    if (sanitizedCells > 0) {
      console.log(`Security: Sanitized ${sanitizedCells} potentially dangerous cells`);
    }
    if (invalidEmails > 0) {
      console.log(`Security: Blocked ${invalidEmails} invalid/suspicious emails`);
    }
    if (namesExtracted > 0) {
      console.log(`Names: Extracted ${namesExtracted} names from email addresses`);
    }

    return {
      data: processed,
      stats: {
        total: rows.length,
        valid: processed.length,
        invalid: invalidEmails,
        duplicates: duplicates,
        sanitized: sanitizedCells,
        namesExtracted: namesExtracted
      }
    };
  };

  const findEmail = (row, headers) => {
    const emailFields = ['email', 'e-mail', 'email address', 'mail'];
    for (let field of emailFields) {
      if (headers.includes(field) && row[field]) return row[field];
    }
    for (let key in row) {
      if (String(row[key]).includes('@')) return row[key];
    }
    return '';
  };

  const findFirstName = (row, headers) => {
    const fields = ['first name', 'firstname', 'first', 'fname'];
    for (let field of fields) {
      if (headers.includes(field) && row[field]) return row[field];
    }
    return '';
  };

  const findLastName = (row, headers) => {
    const fields = ['last name', 'lastname', 'last', 'lname', 'surname'];
    for (let field of fields) {
      if (headers.includes(field) && row[field]) return row[field];
    }
    return '';
  };

  const findName = (row, headers) => {
    const fields = ['name', 'full name', 'fullname', 'contact name'];
    for (let field of fields) {
      if (headers.includes(field) && row[field]) return row[field];
    }
    return '';
  };

  const findCompany = (row, headers) => {
    const fields = ['company', 'company name', 'organization', 'business'];
    for (let field of fields) {
      if (headers.includes(field) && row[field]) return row[field];
    }
    return '';
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    // Security: Check file count limit
    if (files.length >= SECURITY_CONFIG.MAX_FILES) {
      addNotification(`Maximum ${SECURITY_CONFIG.MAX_FILES} files allowed per session`, 'error');
      e.target.value = '';
      return;
    }

    // Security: Validate file before processing
    const fileValidation = validateFile(uploadedFile);
    if (!fileValidation.valid) {
      addNotification(fileValidation.reason, 'error');
      e.target.value = '';
      return;
    }

    setLoading(true);

    try {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, {
            type: 'binary',
            // Security: Disable formula execution
            cellFormula: false,
            cellHTML: false,
          });

          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

          // Security: Validate file content
          const contentValidation = validateFileContent(rawData);
          if (!contentValidation.valid) {
            addNotification(contentValidation.reason, 'error');
            setLoading(false);
            return;
          }

          const { data: processed, stats } = processData(rawData);

          if (processed.length === 0) {
            addNotification('No valid email addresses found in file', 'error');
            setLoading(false);
            return;
          }

          const newFile = {
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: sanitizeFilename(uploadedFile.name),
            data: processed,
            stats: stats,
            columns: [
              { id: 'name', label: 'Name', enabled: true },
              { id: 'email_only', label: 'Email Only', enabled: true },
              { id: 'first_name', label: 'First Name', enabled: true },
              { id: 'last_name', label: 'Last Name', enabled: true },
              { id: 'email', label: 'Email', enabled: true },
              { id: 'company', label: 'Company', enabled: true }
            ]
          };

          setFiles([...files, newFile]);
          setActiveTab(newFile.id);
          setLoading(false);

          // Build success message with stats
          let message = `File processed! ${processed.length} valid contacts found.`;
          if (stats.duplicates > 0) {
            message += ` ${stats.duplicates} duplicates removed.`;
          }
          if (stats.invalid > 0) {
            message += ` ${stats.invalid} invalid emails filtered.`;
          }
          if (stats.namesExtracted > 0) {
            message += ` ${stats.namesExtracted} names extracted from emails.`;
          }
          addNotification(message, 'success');

        } catch (error) {
          console.error('Error processing file:', error);
          addNotification(error.message || 'Error processing file. Please check the format.', 'error');
          setLoading(false);
        }
      };

      reader.onerror = () => {
        addNotification('Error reading file. Please try again.', 'error');
        setLoading(false);
      };

      if (uploadedFile.name.endsWith('.csv')) {
        reader.readAsText(uploadedFile);
      } else {
        reader.readAsBinaryString(uploadedFile);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      addNotification('Error reading file. Please try again.', 'error');
      setLoading(false);
    }

    // Clear the input
    e.target.value = '';
  };

  const handleEdit = (fileId, rowId, field, value) => {
    // Security: Sanitize user input on edit
    const sanitizedValue = sanitizeCell(value);

    setFiles(files.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          data: file.data.map(row =>
            row.id === rowId ? { ...row, [field]: sanitizedValue } : row
          )
        };
      }
      return file;
    }));
  };

  const handleDelete = (fileId, rowId) => {
    setFiles(files.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          data: file.data.filter(row => row.id !== rowId)
        };
      }
      return file;
    }));
  };

  const handleAddRow = (fileId) => {
    setFiles(files.map(file => {
      if (file.id === fileId) {
        const newRow = { id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
        file.columns.forEach(col => {
          newRow[col.id] = '';
        });
        return {
          ...file,
          data: [...file.data, newRow]
        };
      }
      return file;
    }));
  };

  // Column Management Functions
  const handleAddColumn = (fileId) => {
    if (!newColumnName.trim()) {
      addNotification('Please enter a column name', 'error');
      return;
    }

    const sanitizedName = sanitizeCell(newColumnName.trim());
    const columnId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    setFiles(files.map(file => {
      if (file.id === fileId) {
        // Check for duplicate column names
        const existingNames = file.columns.map(c => c.label.toLowerCase());
        if (existingNames.includes(sanitizedName.toLowerCase())) {
          addNotification('A column with this name already exists', 'error');
          return file;
        }

        return {
          ...file,
          columns: [...file.columns, { id: columnId, label: sanitizedName, enabled: true }],
          data: file.data.map(row => ({ ...row, [columnId]: '' }))
        };
      }
      return file;
    }));

    setNewColumnName('');
    addNotification(`Column "${sanitizedName}" added`, 'success');
  };

  const handleRenameColumn = (fileId, columnId, newLabel) => {
    if (!newLabel.trim()) {
      addNotification('Column name cannot be empty', 'error');
      return;
    }

    const sanitizedLabel = sanitizeCell(newLabel.trim());

    setFiles(files.map(file => {
      if (file.id === fileId) {
        // Check for duplicate column names (excluding current column)
        const existingNames = file.columns
          .filter(c => c.id !== columnId)
          .map(c => c.label.toLowerCase());

        if (existingNames.includes(sanitizedLabel.toLowerCase())) {
          addNotification('A column with this name already exists', 'error');
          return file;
        }

        return {
          ...file,
          columns: file.columns.map(col =>
            col.id === columnId ? { ...col, label: sanitizedLabel } : col
          )
        };
      }
      return file;
    }));

    setEditingColumn(null);
    addNotification(`Column renamed to "${sanitizedLabel}"`, 'success');
  };

  const handleDeleteColumn = (fileId, columnId) => {
    setFiles(files.map(file => {
      if (file.id === fileId) {
        // Don't allow deleting if only one column left
        if (file.columns.length <= 1) {
          addNotification('Cannot delete the last column', 'error');
          return file;
        }

        return {
          ...file,
          columns: file.columns.filter(col => col.id !== columnId),
          data: file.data.map(row => {
            const newRow = { ...row };
            delete newRow[columnId];
            return newRow;
          })
        };
      }
      return file;
    }));

    addNotification('Column deleted', 'success');
  };

  const handleToggleColumn = (fileId, columnId) => {
    setFiles(files.map(file => {
      if (file.id === fileId) {
        // Don't allow disabling if it's the last enabled column
        const enabledCount = file.columns.filter(c => c.enabled).length;
        const isCurrentlyEnabled = file.columns.find(c => c.id === columnId)?.enabled;

        if (enabledCount <= 1 && isCurrentlyEnabled) {
          addNotification('At least one column must be enabled', 'error');
          return file;
        }

        return {
          ...file,
          columns: file.columns.map(col =>
            col.id === columnId ? { ...col, enabled: !col.enabled } : col
          )
        };
      }
      return file;
    }));
  };

  const removeTab = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);

    if (activeTab === fileId && updatedFiles.length > 0) {
      setActiveTab(updatedFiles[0].id);
    } else if (updatedFiles.length === 0) {
      setActiveTab(null);
    }
  };

  const createNewTab = () => {
    document.getElementById('file-upload').click();
  };

  const handlePayment = async () => {
    setShowPayment(true);
  };

  const processPayment = async () => {
    try {
      const fileCount = files.length;

      // Save files to localStorage before redirecting to Stripe
      try {
        localStorage.setItem('csv_cleaner_files', JSON.stringify(files));
        console.log('Files saved to localStorage before payment redirect');
      } catch (e) {
        console.error('Error saving files to localStorage:', e);
        addNotification('Error preparing files for download. Please try again.', 'error');
        return;
      }

      const response = await fetch('/api/create-download-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileCount })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        addNotification('Payment failed: ' + data.error, 'error');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      addNotification('Payment processing failed. Please try again or contact support.', 'error');
    }
  };

  // New combined verify and download function
  const verifyPaymentAndDownload = async (sessionId, restoredFiles) => {
    try {
      console.log('Verifying payment for session:', sessionId);

      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Payment verification response:', data);

      if (data.paid) {
        setPaid(true);

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);

        addNotification('Payment successful! Your files are ready to download.', 'success');

        // Use restored files directly since state might not be updated yet
        const filesToDownload = restoredFiles.length > 0 ? restoredFiles : files;

        console.log('Files to download:', filesToDownload.length);

        if (filesToDownload.length === 0) {
          addNotification('No files found. Please upload your files again.', 'error');
          return;
        }

        // Initialize file renames and show modal
        const renames = {};
        filesToDownload.forEach(file => {
          renames[file.id] = sanitizeFilename(`cleaned_${file.name}`);
        });

        // Small delay to ensure state is ready, then show modal
        setTimeout(() => {
          setFileRenames(renames);
          setShowFileRename(true);
          console.log('Download modal should now be visible');
        }, 300);

      } else {
        console.error('Payment verification failed:', data.error);
        addNotification('Payment verification failed. Please contact support.', 'error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      addNotification('Could not verify payment. Please contact support with your order details.', 'error');
    }
  };

  const verifyPayment = async (sessionId) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.paid) {
        setPaid(true);
        window.history.replaceState({}, document.title, window.location.pathname);
        addNotification('Payment successful! Your files are ready to download.', 'success');

        // Get files from localStorage since state might not be ready yet
        let filesToDownload = files;
        if (filesToDownload.length === 0) {
          try {
            const savedFiles = localStorage.getItem('csv_cleaner_files');
            if (savedFiles) {
              filesToDownload = JSON.parse(savedFiles);
              setFiles(filesToDownload);
              setShowApp(true);
              if (filesToDownload.length > 0) {
                setActiveTab(filesToDownload[0].id);
              }
            }
          } catch (e) {
            console.error('Error restoring files:', e);
          }
        }

        // Prepare downloads with slight delay to ensure state is ready
        setTimeout(() => {
          prepareDownloadsWithFiles(filesToDownload);
        }, 500);
      } else {
        console.error('Payment verification failed:', data.error);
        addNotification('Payment verification failed. Please contact support.', 'error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      addNotification('Could not verify payment. Please contact support with your order details.', 'error');
    }
  };

  // Prepare downloads with explicit files parameter (for post-payment flow)
  const prepareDownloadsWithFiles = (filesToUse) => {
    const fileList = filesToUse || files;
    if (fileList.length === 0) {
      addNotification('No files found to download. Please upload your files again.', 'error');
      return;
    }

    const renames = {};
    fileList.forEach(file => {
      renames[file.id] = sanitizeFilename(`cleaned_${file.name}`);
    });
    setFileRenames(renames);
    setShowFileRename(true);
  };

  const prepareDownloads = () => {
    prepareDownloadsWithFiles(files);
  };

  const handleDownloadAll = () => {
    if (!paid) {
      handlePayment();
      return;
    }

    // Show file rename dialog
    prepareDownloads();
  };

  const executeDownloads = () => {
    // Get files - prefer state, fallback to localStorage
    let filesToDownload = files;
    if (filesToDownload.length === 0) {
      try {
        const savedFiles = localStorage.getItem('csv_cleaner_files');
        if (savedFiles) {
          filesToDownload = JSON.parse(savedFiles);
        }
      } catch (e) {
        console.error('Error getting files:', e);
      }
    }

    if (filesToDownload.length === 0) {
      addNotification('No files to download. Please upload your files again.', 'error');
      setShowFileRename(false);
      return;
    }

    filesToDownload.forEach(file => {
      const enabledColumns = file.columns.filter(col => col.enabled);
      const exportData = file.data.map(row => {
        const exportRow = {};
        enabledColumns.forEach(col => {
          // Security: Ensure CSV injection protection on export
          let value = sanitizeCell(row[col.id] || '');
          exportRow[col.label] = value;
        });
        return exportRow;
      });

      const headers = enabledColumns.map(col => col.label);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row =>
          headers.map(header => {
            const value = String(row[header] || '');
            // Properly escape for CSV (handle commas, quotes, and newlines)
            return value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      // Security: Sanitize the download filename
      let downloadName = fileRenames[file.id] || `cleaned_${file.name}`;
      // Ensure .csv extension
      if (!downloadName.toLowerCase().endsWith('.csv')) {
        downloadName += '.csv';
      }
      downloadName = sanitizeFilename(downloadName);

      link.setAttribute('href', url);
      link.setAttribute('download', downloadName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });

    // Clean up localStorage after successful download
    try {
      localStorage.removeItem('csv_cleaner_files');
    } catch (e) {
      console.error('Error cleaning localStorage:', e);
    }

    setShowFileRename(false);
    addNotification(`Successfully downloaded ${filesToDownload.length} file${filesToDownload.length > 1 ? 's' : ''}!`, 'success');
  };

  const activeFile = files.find(f => f.id === activeTab);
  const totalPrice = (files.length * 5.99).toFixed(2);

  // Notification Component
  const NotificationIcon = ({ type }) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  // Landing Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col">
        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-sm animate-slide-in ${notif.type === 'success' ? 'bg-green-500 text-white' :
                notif.type === 'error' ? 'bg-red-500 text-white' :
                  'bg-blue-500 text-white'
                }`}
            >
              <NotificationIcon type={notif.type} />
              <span className="font-medium">{notif.message}</span>
            </div>
          ))}
        </div>

        {/* Header with Auth */}
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-white text-2xl font-bold">CSV Cleaner</div>
            <button
              onClick={() => { setShowAuth(true); setAuthMode('login'); }}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium backdrop-blur-sm border border-white/20 transition"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-white font-medium">Clean Your Email Lists in Seconds</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Messy<br />Email Lists into<br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Campaign-Ready Data
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Process multiple files at once. $5.99 per file. No subscriptions. See results before you pay.
            </p>

            <button
              onClick={() => { setShowAuth(true); setAuthMode('register'); }}
              className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl transform hover:scale-105 transition inline-flex items-center gap-3"
            >
              Get Started Free
              <ArrowRight className="w-6 h-6" />
            </button>

            <p className="text-gray-400 mt-6">First file free preview • Pay only when you download</p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multi-File Processing</h3>
              <p className="text-gray-400">Open multiple tabs, process all your files at once. Pay for what you use.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Enterprise Security</h3>
              <p className="text-gray-400">CSV injection protection, XSS prevention, and secure processing. Your data is safe.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Campaign Ready</h3>
              <p className="text-gray-400">Duplicates removed, data sanitized, ready for any email platform.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer variant="dark" />

        {/* Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <button onClick={() => { setShowAuth(false); setAuthError(''); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  {authMode === 'register' && (
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
                >
                  {authLoading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // App Interface - Welcome Screen
  if (!showApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col">
        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-sm ${notif.type === 'success' ? 'bg-green-500 text-white' :
                notif.type === 'error' ? 'bg-red-500 text-white' :
                  'bg-blue-500 text-white'
                }`}
            >
              <NotificationIcon type={notif.type} />
              <span className="font-medium">{notif.message}</span>
            </div>
          ))}
        </div>

        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center mb-12">
            <div className="text-white text-2xl font-bold">CSV Cleaner</div>
            <div className="flex items-center gap-4">
              <div className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium backdrop-blur-sm border border-white/20 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-6">Ready to Clean Your Lists?</h1>
            <p className="text-xl text-gray-300 mb-12">
              Upload your first file and start processing. Add more files in tabs as you go.
            </p>

            <button
              onClick={() => setShowApp(true)}
              className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl transform hover:scale-105 transition inline-flex items-center gap-3"
            >
              Start Processing
              <ArrowRight className="w-6 h-6" />
            </button>

            {/* Security Badge */}
            <div className="mt-12 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-white text-sm">Enterprise-grade security enabled</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer variant="dark" />
      </div>
    );
  }

  // Main App Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl ${notif.type === 'success' ? 'bg-green-500 text-white' :
              notif.type === 'error' ? 'bg-red-500 text-white' :
                'bg-blue-500 text-white'
              }`}
          >
            <NotificationIcon type={notif.type} />
            <span className="font-medium">{notif.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-gray-800">CSV Cleaner</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        {files.length > 0 && (
          <div className="bg-white rounded-t-lg shadow-lg overflow-x-auto">
            <div className="flex items-center border-b border-gray-200">
              {files.map(file => (
                <div
                  key={file.id}
                  className={`flex items-center gap-2 px-6 py-3 cursor-pointer border-r border-gray-200 min-w-max ${activeTab === file.id
                    ? 'bg-indigo-50 border-b-2 border-indigo-600'
                    : 'hover:bg-gray-50'
                    }`}
                  onClick={() => setActiveTab(file.id)}
                >
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-800">
                    {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                  </span>
                  <span className="text-xs text-gray-500">({file.data.length})</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeTab(file.id); }}
                    className="ml-2 text-gray-400 hover:text-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={createNewTab}
                className="flex items-center gap-2 px-6 py-3 text-indigo-600 hover:bg-indigo-50 font-medium transition min-w-max"
              >
                <Plus className="w-4 h-4" />
                New File
              </button>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {files.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <Upload className="w-16 h-16 text-indigo-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Your First File</h2>
              <p className="text-gray-600 mb-2 text-center">CSV or Excel files (.csv, .xlsx, .xls)</p>
              <p className="text-sm text-gray-500 mb-6 text-center">
                Max {SECURITY_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB • {SECURITY_CONFIG.MAX_ROWS.toLocaleString()} rows • {SECURITY_CONFIG.MAX_FILES} files per session
              </p>
              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition">
                {loading ? 'Processing...' : 'Choose File'}
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>
          </div>
        )}

        {/* Hidden file input for new tabs */}
        {files.length > 0 && (
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            disabled={loading}
          />
        )}

        {/* Data Table */}
        {activeFile && (
          <div className="bg-white rounded-b-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{activeFile.name}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>{activeFile.data.length} contacts</span>
                  <span>•</span>
                  <span>{activeFile.columns.filter(c => c.enabled).length} columns</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Sanitized
                  </span>
                  {activeFile.stats?.duplicates > 0 && (
                    <>
                      <span>•</span>
                      <span>{activeFile.stats.duplicates} duplicates removed</span>
                    </>
                  )}
                  {activeFile.stats?.namesExtracted > 0 && (
                    <>
                      <span>•</span>
                      <span>{activeFile.stats.namesExtracted} names extracted</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowColumnManager(!showColumnManager)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${showColumnManager
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                >
                  <Columns className="w-4 h-4" />
                  Manage Columns
                </button>
                <button
                  onClick={() => handleAddRow(activeFile.id)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Row
                </button>
              </div>
            </div>

            {/* Column Manager Panel */}
            {showColumnManager && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Column Manager
                  </h3>
                  <button
                    onClick={() => setShowColumnManager(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Add New Column */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddColumn(activeFile.id)}
                    placeholder="New column name..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleAddColumn(activeFile.id)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Column
                  </button>
                </div>

                {/* Column List */}
                <div className="space-y-2">
                  {activeFile.columns.map((col, index) => (
                    <div
                      key={col.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${col.enabled ? 'bg-white border border-gray-200' : 'bg-gray-100 border border-gray-200 opacity-60'
                        }`}
                    >
                      {/* Drag Handle / Index */}
                      <span className="text-gray-400 text-sm font-mono w-6">{index + 1}</span>

                      {/* Column Name (Editable) */}
                      {editingColumn?.columnId === col.id ? (
                        <input
                          type="text"
                          defaultValue={col.label}
                          autoFocus
                          onBlur={(e) => handleRenameColumn(activeFile.id, col.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleRenameColumn(activeFile.id, col.id, e.target.value);
                            } else if (e.key === 'Escape') {
                              setEditingColumn(null);
                            }
                          }}
                          className="flex-1 px-2 py-1 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <span className="flex-1 font-medium text-gray-700">{col.label}</span>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {/* Edit Name */}
                        <button
                          onClick={() => setEditingColumn({ fileId: activeFile.id, columnId: col.id, currentLabel: col.label })}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                          title="Rename column"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Toggle Visibility */}
                        <button
                          onClick={() => handleToggleColumn(activeFile.id, col.id)}
                          className={`p-1.5 rounded transition ${col.enabled
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-100'
                            }`}
                          title={col.enabled ? 'Hide column' : 'Show column'}
                        >
                          {col.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        {/* Delete Column */}
                        <button
                          onClick={() => handleDeleteColumn(activeFile.id, col.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete column"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  💡 Click the edit icon to rename columns. Hidden columns won't appear in exports.
                </p>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    {activeFile.columns.filter(col => col.enabled).map(col => (
                      <th key={col.id} className="px-4 py-3 text-left font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          {col.label}
                          <button
                            onClick={() => setEditingColumn({ fileId: activeFile.id, columnId: col.id, currentLabel: col.label })}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-indigo-600 rounded transition"
                            title="Rename column"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activeFile.data.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {activeFile.columns.filter(col => col.enabled).map(col => (
                        <td key={col.id} className="px-4 py-3">
                          <input
                            type={col.id.includes('email') ? 'email' : 'text'}
                            value={row[col.id] || ''}
                            onChange={(e) => handleEdit(activeFile.id, row.id, col.id, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(activeFile.id, row.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bottom Action Bar */}
        {files.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-gray-800">
                  <span className="font-bold text-2xl">{files.length}</span>
                  <span className="text-gray-600 ml-2">file{files.length > 1 ? 's' : ''} ready</span>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="text-gray-800">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-bold text-2xl ml-2">${totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition"
              >
                {paid ? (
                  <>
                    <Download className="w-5 h-5" />
                    Download All Files
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Pay & Download All
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Ready to Download?</h3>

              <div className="bg-indigo-50 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Files to process:</span>
                  <span className="font-bold text-gray-800">{files.length}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price per file:</span>
                  <span className="font-bold text-gray-800">$5.99</span>
                </div>
                <div className="border-t border-indigo-200 my-3"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-3xl font-bold text-indigo-600">${totalPrice}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={processPayment}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-lg font-bold text-lg transition"
                >
                  Pay ${totalPrice} with Stripe
                </button>
                <button
                  onClick={() => setShowPayment(false)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Secure payment processed by Stripe
              </p>
            </div>
          </div>
        )}

        {/* File Rename Modal - Save As Dialog */}
        {showFileRename && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
              {/* Success Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Payment Successful!</h3>
                <p className="text-gray-600 mt-2">Your files are ready. Name them and click download.</p>
              </div>

              <div className="space-y-4 mb-6">
                {(files.length > 0 ? files : (() => {
                  try {
                    const saved = localStorage.getItem('csv_cleaner_files');
                    return saved ? JSON.parse(saved) : [];
                  } catch { return []; }
                })()).map((file, index) => (
                  <div key={file.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Original: {file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({file.data?.length || 0} contacts)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">Save as:</span>
                      <input
                        type="text"
                        value={fileRenames[file.id] || ''}
                        onChange={(e) => setFileRenames({ ...fileRenames, [file.id]: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter file name..."
                      />
                      <span className="text-gray-400 text-sm">.csv</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={executeDownloads}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Download className="w-6 h-6" />
                  Download Files Now
                </button>
              </div>

              <button
                onClick={() => setShowFileRename(false)}
                className="w-full mt-3 text-gray-500 hover:text-gray-700 py-2 text-sm transition"
              >
                Download Later
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom padding for fixed action bar */}
      {files.length > 0 && <div className="h-24"></div>}

      {/* Footer - only show when no files (action bar covers it otherwise) */}
      {files.length === 0 && <Footer variant="light" />}
    </div>
  );
};

export default EmailListCleaner;