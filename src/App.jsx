import React, { useState } from 'react';
import { Upload, Download, Trash2, Plus, DollarSign, CheckCircle, Mail, Zap, Shield, ArrowRight, X } from 'lucide-react';

const EmailListCleaner = () => {
  const [showApp, setShowApp] = useState(false);
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('single');
  const [showColumnEditor, setShowColumnEditor] = useState(false);
  const [columns, setColumns] = useState([
    { id: 'name', label: 'Name', enabled: true },
    { id: 'email_only', label: 'Email Only', enabled: true },
    { id: 'first_name', label: 'First Name', enabled: true },
    { id: 'last_name', label: 'Last Name', enabled: true },
    { id: 'email', label: 'Email', enabled: true },
    { id: 'company', label: 'Company', enabled: true }
  ]);

  const pricingPlans = {
    single: { name: 'Single File', price: 7.99, files: 1, popular: false },
    small: { name: 'Small Pack', price: 29.99, files: 5, popular: true },
    large: { name: 'Large Pack', price: 99.99, files: 20, popular: false }
  };

  // Process uploaded file
  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
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
          setData(processed);
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
        id: Date.now() + Math.random(),
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

  const handleEdit = (id, field, value) => {
    setData(data.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleDelete = (id) => {
    setData(data.filter(row => row.id !== id));
  };

  const handleAddRow = () => {
    const newRow = { id: Date.now() };
    columns.forEach(col => {
      newRow[col.id] = '';
    });
    setData([...data, newRow]);
  };

  const addColumn = () => {
    const newColumnName = prompt('Enter new column name:');
    if (newColumnName && newColumnName.trim()) {
      const columnId = newColumnName.toLowerCase().replace(/\s+/g, '_');
      setColumns([...columns, {
        id: columnId,
        label: newColumnName.trim(),
        enabled: true
      }]);
      // Add empty value for this column to all existing rows
      setData(data.map(row => ({ ...row, [columnId]: '' })));
    }
  };

  const removeColumn = (columnId) => {
    setColumns(columns.filter(col => col.id !== columnId));
  };

  const renameColumn = (columnId, newLabel) => {
    setColumns(columns.map(col =>
      col.id === columnId ? { ...col, label: newLabel } : col
    ));
  };

  const toggleColumn = (columnId) => {
    setColumns(columns.map(col =>
      col.id === columnId ? { ...col, enabled: !col.enabled } : col
    ));
  };

  const getEnabledColumns = () => columns.filter(col => col.enabled);

  const handlePayment = () => {
    setShowPayment(true);
  };

  const processPayment = async () => {
    // This is where you'd integrate Stripe Checkout
    // Example:
    /*
    const response = await fetch('https://yourdomain.com/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan: selectedPlan,
        amount: pricingPlans[selectedPlan].price * 100,
        success_url: window.location.href + '?payment=success',
        cancel_url: window.location.href
      })
    });
    const { url } = await response.json();
    window.location.href = url;
    */

    // Simulated payment
    setTimeout(() => {
      setPaid(true);
      setShowPayment(false);
    }, 1500);
  };

  const handleDownload = () => {
    if (!paid) {
      handlePayment();
      return;
    }

    const enabledColumns = getEnabledColumns();
    const exportData = data.map(row => {
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
    link.setAttribute('download', 'cleaned_email_list.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetApp = () => {
    setData([]);
    setFile(null);
    setPaid(false);
    setShowApp(false);
  };

  // Landing Page
  if (!showApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
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
              Upload your CSV or Excel file and instantly get perfectly formatted contacts. No account needed. Pay only when you download.
            </p>

            <button
              onClick={() => setShowApp(true)}
              className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl transform hover:scale-105 transition inline-flex items-center gap-3"
            >
              Start Cleaning Now
              <ArrowRight className="w-6 h-6" />
            </button>

            <p className="text-gray-400 mt-6">No signup required • See results before you pay</p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Processing</h3>
              <p className="text-gray-400">Upload your file and see cleaned results in seconds. No waiting, no servers, all in your browser.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">100% Private</h3>
              <p className="text-gray-400">Your data never leaves your browser. We don't store anything. Complete privacy guaranteed.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Campaign Ready</h3>
              <p className="text-gray-400">Get perfectly formatted columns for any email platform. Duplicates removed, data validated.</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-300 text-center mb-12">Pay only for what you need. See your cleaned data before purchasing.</p>

            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(pricingPlans).map(([key, plan]) => (
                <div
                  key={key}
                  className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-8 ${plan.popular ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-105' : 'border-white/10'
                    }`}
                >
                  {plan.popular && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-bold px-4 py-1 rounded-full inline-block mb-4">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400 ml-2">/ {plan.files} {plan.files === 1 ? 'file' : 'files'}</span>
                  </div>
                  {plan.files > 1 && (
                    <p className="text-green-400 font-medium mb-6">
                      ${(plan.price / plan.files).toFixed(2)} per file
                    </p>
                  )}
                  <ul className="space-y-3 mb-8 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Remove duplicates
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Format columns
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Edit before download
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Instant processing
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Bottom */}
          <div className="text-center mt-20">
            <button
              onClick={() => setShowApp(true)}
              className="bg-white hover:bg-gray-100 text-purple-900 px-12 py-5 rounded-full text-xl font-bold shadow-2xl transform hover:scale-105 transition inline-flex items-center gap-3"
            >
              Try It Now - It's Free to Preview
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // App Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Email List Cleaner</h1>
              <p className="text-gray-600">Upload • Clean • Edit • Download</p>
            </div>
            <button
              onClick={resetApp}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Upload Section */}
        {data.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <Upload className="w-16 h-16 text-indigo-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Your File</h2>
              <p className="text-gray-600 mb-6 text-center">Support for CSV and Excel files (.xlsx, .xls)</p>
              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition">
                {loading ? 'Processing...' : 'Choose File'}
                <input
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

        {/* Data Table */}
        {data.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Your Cleaned Data</h2>
                <p className="text-sm text-gray-600">{data.length} contacts • Duplicates removed</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowColumnEditor(true)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  <Mail className="w-4 h-4" />
                  Customize Columns
                </button>
                <button
                  onClick={handleAddRow}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Row
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  {paid ? (
                    <>
                      <Download className="w-4 h-4" />
                      Download CSV
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4" />
                      Purchase & Download
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    {getEnabledColumns().map(col => (
                      <th key={col.id} className="px-4 py-3 text-left font-semibold text-gray-700">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {getEnabledColumns().map(col => (
                        <td key={col.id} className="px-4 py-3">
                          <input
                            type={col.id.includes('email') ? 'email' : 'text'}
                            value={row[col.id] || ''}
                            onChange={(e) => handleEdit(row.id, col.id, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(row.id)}
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

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Plan</h3>

              <div className="space-y-4 mb-6">
                {Object.entries(pricingPlans).map(([key, plan]) => (
                  <label
                    key={key}
                    className={`block border-2 rounded-lg p-4 cursor-pointer transition ${selectedPlan === key
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={key}
                      checked={selectedPlan === key}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-800">{plan.name}</div>
                        <div className="text-sm text-gray-600">{plan.files} {plan.files === 1 ? 'file' : 'files'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">${plan.price}</div>
                        {plan.files > 1 && (
                          <div className="text-xs text-green-600">${(plan.price / plan.files).toFixed(2)} per file</div>
                        )}
                      </div>
                    </div>
                    {plan.popular && (
                      <div className="mt-2 text-xs font-semibold text-indigo-600">MOST POPULAR</div>
                    )}
                  </label>
                ))}
              </div>

              <div className="space-y-3">
                <button
                  onClick={processPayment}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
                >
                  Pay ${pricingPlans[selectedPlan].price} with Stripe
                </button>
                <button
                  onClick={() => setShowPayment(false)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Secure payment processed by Stripe
              </p>
            </div>
          </div>
        )}

        {/* Column Editor Modal */}
        {showColumnEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Customize Columns</h3>
                <button
                  onClick={() => setShowColumnEditor(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Toggle, rename, or remove columns. Only enabled columns will appear in your downloaded CSV.
              </p>

              <div className="space-y-3 mb-6">
                {columns.map(col => (
                  <div
                    key={col.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={col.enabled}
                      onChange={() => toggleColumn(col.id)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={col.label}
                      onChange={(e) => renameColumn(col.id, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Column name"
                    />
                    <button
                      onClick={() => removeColumn(col.id)}
                      className="text-red-600 hover:text-red-800 transition p-2"
                      title="Remove column"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addColumn}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition mb-4"
              >
                <Plus className="w-5 h-5" />
                Add New Column
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowColumnEditor(false)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
                >
                  Done
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> You can add custom columns for things like phone numbers, addresses, tags, or any other data your email platform needs!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {paid && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <CheckCircle className="w-5 h-5" />
            Payment Successful!
          </div>
        )}

        {/* Upsell Banner (after download) */}
        {paid && (
          <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Ready to send these emails?</h3>
                <p className="text-purple-100">Try our mass email platform - send to thousands with high deliverability</p>
              </div>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition whitespace-nowrap">
                Learn More →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailListCleaner;