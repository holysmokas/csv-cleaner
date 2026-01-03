import React, { useState, useEffect } from 'react';
import { Upload, Download, Trash2, Plus, X, Mail, Zap, Shield, ArrowRight, CheckCircle, LogOut, User, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from './lib/supabase';

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

    // Check for payment success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      const sessionId = urlParams.get('session_id');
      verifyPayment(sessionId);
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
            data: {
              name: authForm.name
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // Check if email confirmation is required
          if (data.user.identities?.length === 0) {
            setAuthError('This email is already registered. Please sign in instead.');
          } else {
            alert('Registration successful! Please check your email to confirm your account.');
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
  };

  // File processing functions
  const processData = (rawData) => {
    if (rawData.length === 0) return [];

    const headers = rawData[0].map(h => String(h || '').toLowerCase().trim());
    const rows = rawData.slice(1);

    const processed = [];
    const seenEmails = new Set();

    rows.forEach(row => {
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index] || '';
      });

      let email = findEmail(rowData, headers);
      let firstName = findFirstName(rowData, headers);
      let lastName = findLastName(rowData, headers);
      let company = findCompany(rowData, headers);
      let name = findName(rowData, headers);

      if (!email) return;
      email = String(email).toLowerCase().trim();
      if (seenEmails.has(email)) return;
      seenEmails.add(email);

      if (name && !firstName && !lastName) {
        const parts = String(name).trim().split(/\s+/);
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
      }

      processed.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name || `${firstName} ${lastName}`.trim() || '',
        email_only: email,
        first_name: firstName || '',
        last_name: lastName || '',
        email: email,
        company: company || ''
      });
    });

    return processed;
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

    setLoading(true);

    try {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

          const processed = processData(rawData);

          const newFile = {
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: uploadedFile.name,
            data: processed,
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
        } catch (error) {
          console.error('Error processing file:', error);
          alert('Error processing file. Please check the format.');
          setLoading(false);
        }
      };

      if (uploadedFile.name.endsWith('.csv')) {
        reader.readAsText(uploadedFile);
      } else {
        reader.readAsBinaryString(uploadedFile);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      setLoading(false);
    }
  };

  const handleEdit = (fileId, rowId, field, value) => {
    setFiles(files.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          data: file.data.map(row =>
            row.id === rowId ? { ...row, [field]: value } : row
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

      const response = await fetch('/api/create-download-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileCount })
      });

      const { url, error } = await response.json();

      if (error) {
        alert('Payment failed: ' + error);
        return;
      }

      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const verifyPayment = async (sessionId) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });

      const { paid: paymentVerified } = await response.json();

      if (paymentVerified) {
        setPaid(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  const handleDownloadAll = () => {
    if (!paid) {
      handlePayment();
      return;
    }

    files.forEach(file => {
      const enabledColumns = file.columns.filter(col => col.enabled);
      const exportData = file.data.map(row => {
        const exportRow = {};
        enabledColumns.forEach(col => {
          exportRow[col.label] = row[col.id] || '';
        });
        return exportRow;
      });

      const headers = enabledColumns.map(col => col.label);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row =>
          headers.map(header => {
            const value = String(row[header] || '');
            return value.includes(',') || value.includes('"')
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `cleaned_${file.name}`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const activeFile = files.find(f => f.id === activeTab);
  const totalPrice = (files.length * 5.99).toFixed(2);

  // Landing Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
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
              <h3 className="text-xl font-bold text-white mb-3">100% Private</h3>
              <p className="text-gray-400">Your data is processed in your browser. We never see or store your contacts.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Campaign Ready</h3>
              <p className="text-gray-400">Duplicates removed, data formatted, ready for any email platform.</p>
            </div>
          </div>
        </div>

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

  // App Interface
  if (!showApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-gray-800">CSV Cleaner</h1>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user?.name}</span>
              </div>
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
              <p className="text-gray-600 mb-6 text-center">CSV or Excel files (.xlsx, .xls)</p>
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
                <p className="text-sm text-gray-600">{activeFile.data.length} contacts • Duplicates removed</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAddRow(activeFile.id)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Row
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    {activeFile.columns.filter(col => col.enabled).map(col => (
                      <th key={col.id} className="px-4 py-3 text-left font-semibold text-gray-700">
                        {col.label}
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

        {/* Success Toast */}
        {paid && (
          <div className="fixed bottom-20 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-bounce">
            <CheckCircle className="w-6 h-6" />
            <div>
              <div className="font-bold">Payment Successful!</div>
              <div className="text-sm">Your files are ready to download</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailListCleaner;