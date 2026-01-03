import React from 'react';
import { Cookie, ArrowLeft, Settings, BarChart3, Shield, ToggleLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
    const lastUpdated = "January 3, 2026";
    const companyName = "CSV Cleaner";
    const companyEmail = "privacy@csvcleaner.online";
    const companyWebsite = "csvcleaner.online";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to App
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    {/* Title */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Cookie className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
                            <p className="text-gray-500">Last updated: {lastUpdated}</p>
                        </div>
                    </div>

                    {/* Introduction */}
                    <section className="mb-8">
                        <p className="text-gray-700 leading-relaxed">
                            This Cookie Policy explains how {companyName} ("{companyWebsite}") uses cookies and similar technologies when you visit our website. It explains what these technologies are, why we use them, and your rights to control our use of them.
                        </p>
                    </section>

                    {/* What Are Cookies */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
                        <p className="text-gray-700 mb-4">
                            Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-blue-800">
                                <strong>Note:</strong> We use cookies primarily for essential functions like keeping you logged in. We do not use cookies for advertising or tracking you across other websites.
                            </p>
                        </div>
                    </section>

                    {/* Types of Cookies */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>

                        {/* Essential Cookies */}
                        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-green-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
                                <Shield className="w-5 h-5 text-green-600" />
                                <h3 className="font-semibold text-green-800">Essential Cookies</h3>
                                <span className="ml-auto text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Required</span>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-700 mb-4">
                                    These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take, such as logging in or filling out forms.
                                </p>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="text-left px-3 py-2 border">Cookie Name</th>
                                            <th className="text-left px-3 py-2 border">Purpose</th>
                                            <th className="text-left px-3 py-2 border">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-3 py-2 border font-mono text-xs">sb-access-token</td>
                                            <td className="px-3 py-2 border">Supabase authentication</td>
                                            <td className="px-3 py-2 border">1 hour</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2 border font-mono text-xs">sb-refresh-token</td>
                                            <td className="px-3 py-2 border">Session refresh</td>
                                            <td className="px-3 py-2 border">7 days</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2 border font-mono text-xs">__cf_bm</td>
                                            <td className="px-3 py-2 border">Cloudflare bot protection</td>
                                            <td className="px-3 py-2 border">30 minutes</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Functional Cookies */}
                        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
                                <Settings className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-blue-800">Functional Cookies</h3>
                                <span className="ml-auto text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Optional</span>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-700 mb-4">
                                    These cookies enable enhanced functionality and personalization, such as remembering your preferences.
                                </p>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="text-left px-3 py-2 border">Cookie Name</th>
                                            <th className="text-left px-3 py-2 border">Purpose</th>
                                            <th className="text-left px-3 py-2 border">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-3 py-2 border font-mono text-xs">csv_cleaner_prefs</td>
                                            <td className="px-3 py-2 border">User preferences</td>
                                            <td className="px-3 py-2 border">1 year</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2 border font-mono text-xs">theme</td>
                                            <td className="px-3 py-2 border">Dark/light mode preference</td>
                                            <td className="px-3 py-2 border">1 year</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Analytics Cookies */}
                        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-purple-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-purple-800">Analytics Cookies</h3>
                                <span className="ml-auto text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">Optional</span>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-700 mb-4">
                                    These cookies help us understand how visitors interact with our website by collecting anonymized information.
                                </p>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="text-left px-3 py-2 border">Cookie Name</th>
                                            <th className="text-left px-3 py-2 border">Purpose</th>
                                            <th className="text-left px-3 py-2 border">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-3 py-2 border font-mono text-xs">_cf_analytics</td>
                                            <td className="px-3 py-2 border">Cloudflare Web Analytics (privacy-focused)</td>
                                            <td className="px-3 py-2 border">Session</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p className="text-gray-600 text-sm mt-3">
                                    We use Cloudflare Web Analytics, which is privacy-focused and does not use cookies that track you across sites. It does not collect personal information.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Local Storage */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Local Storage</h2>
                        <p className="text-gray-700 mb-4">
                            In addition to cookies, we use browser local storage for temporary data:
                        </p>
                        <table className="w-full text-sm border">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left px-3 py-2 border">Key</th>
                                    <th className="text-left px-3 py-2 border">Purpose</th>
                                    <th className="text-left px-3 py-2 border">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="px-3 py-2 border font-mono text-xs">csv_cleaner_files</td>
                                    <td className="px-3 py-2 border">Temporarily stores file data during payment process</td>
                                    <td className="px-3 py-2 border">Cleared after download</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-gray-600 text-sm mt-3">
                            This data is stored only in your browser and is never sent to our servers. It is automatically cleared after you download your files.
                        </p>
                    </section>

                    {/* Third-Party Cookies */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
                        <p className="text-gray-700 mb-4">
                            Some cookies are placed by third-party services that appear on our pages:
                        </p>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Stripe (Payment Processing)</h4>
                                <p className="text-gray-700 text-sm">
                                    When you make a payment, Stripe may set cookies to prevent fraud and process your payment securely. These cookies are governed by <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Stripe's Privacy Policy</a>.
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Cloudflare (Security & Performance)</h4>
                                <p className="text-gray-700 text-sm">
                                    Cloudflare provides security and performance services. They may set cookies for bot detection and DDoS protection. See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Cloudflare's Privacy Policy</a>.
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Supabase (Authentication)</h4>
                                <p className="text-gray-700 text-sm">
                                    Supabase handles user authentication and may set cookies for session management. See <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Supabase's Privacy Policy</a>.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Managing Cookies */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ToggleLeft className="w-5 h-5" />
                            Managing Your Cookie Preferences
                        </h2>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Browser Settings</h3>
                        <p className="text-gray-700 mb-4">
                            Most web browsers allow you to control cookies through their settings. You can:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li>View what cookies are stored on your device</li>
                            <li>Delete all or specific cookies</li>
                            <li>Block all cookies or third-party cookies</li>
                            <li>Set preferences for specific websites</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Browser-Specific Instructions</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                <span className="font-medium text-gray-800">Google Chrome →</span>
                            </a>
                            <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                <span className="font-medium text-gray-800">Mozilla Firefox →</span>
                            </a>
                            <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                <span className="font-medium text-gray-800">Apple Safari →</span>
                            </a>
                            <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                <span className="font-medium text-gray-800">Microsoft Edge →</span>
                            </a>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-4">
                            <p className="text-amber-800">
                                <strong>⚠️ Warning:</strong> Blocking essential cookies may prevent you from logging in or using certain features of the Service.
                            </p>
                        </div>
                    </section>

                    {/* Do Not Track */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Do Not Track</h2>
                        <p className="text-gray-700">
                            Some browsers have a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked. Since we do not track users across third-party websites, we respond to DNT signals by default. Our analytics are privacy-focused and do not identify individual users.
                        </p>
                    </section>

                    {/* Updates */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                        <p className="text-gray-700">
                            We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
                        <p className="text-gray-700 mb-4">
                            If you have questions about our use of cookies, contact us:
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700"><strong>Email:</strong> <a href={`mailto:${companyEmail}`} className="text-indigo-600 hover:underline">{companyEmail}</a></p>
                            <p className="text-gray-700"><strong>Website:</strong> {companyWebsite}</p>
                        </div>
                    </section>

                    {/* Footer Links */}
                    <div className="border-t border-gray-200 pt-6 mt-8">
                        <p className="text-gray-600 text-sm">
                            Related policies: {' '}
                            <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link> • {' '}
                            <Link to="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link> • {' '}
                            <Link to="/acceptable-use" className="text-indigo-600 hover:underline">Acceptable Use Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;