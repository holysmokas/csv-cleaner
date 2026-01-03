import React from 'react';
import { Shield, ArrowLeft, Mail, Globe, Server, Lock, UserCheck, Trash2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                            <p className="text-gray-500">Last updated: {lastUpdated}</p>
                        </div>
                    </div>

                    {/* Introduction */}
                    <section className="mb-8">
                        <p className="text-gray-700 leading-relaxed">
                            {companyName} ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our CSV email list cleaning service at {companyWebsite} (the "Service"). Please read this policy carefully. By using the Service, you consent to the practices described in this Privacy Policy.
                        </p>
                    </section>

                    {/* GDPR Notice */}
                    <section className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                        <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            For European Union (EU) Users - GDPR Compliance
                        </h2>
                        <p className="text-blue-800">
                            If you are located in the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. Your rights are detailed in Section 8 of this policy.
                        </p>
                    </section>

                    {/* Section 1 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 Information You Provide</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</li>
                            <li><strong>Payment Information:</strong> When you make a purchase, payment is processed by Stripe. We do not store your full credit card number. We receive only a transaction ID, amount paid, and billing email.</li>
                            <li><strong>Uploaded Files:</strong> CSV and Excel files you upload for cleaning. These files may contain names, email addresses, company names, and other contact information.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2 Automatically Collected Information</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Log Data:</strong> IP address, browser type, operating system, referring URLs, and timestamps.</li>
                            <li><strong>Device Information:</strong> Device type, screen resolution, and browser settings.</li>
                            <li><strong>Cookies:</strong> We use essential cookies for authentication and session management. See Section 6 for details.</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <p className="text-gray-700 mb-4">We use the information we collect to:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Provide, maintain, and improve the Service</li>
                            <li>Process your files and deliver cleaned email lists</li>
                            <li>Process payments and send transaction confirmations</li>
                            <li>Communicate with you about updates, security alerts, and support</li>
                            <li>Detect, prevent, and address technical issues and fraud</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Server className="w-5 h-5" />
                            3. Data Processing & Storage
                        </h2>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold text-green-800 mb-2">🔒 Client-Side Processing</h3>
                            <p className="text-green-700">
                                <strong>Your uploaded files are processed entirely in your browser.</strong> The CSV/Excel data you upload never leaves your device and is never transmitted to or stored on our servers. All cleaning, deduplication, and validation happens locally on your computer using JavaScript.
                            </p>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">What We Store:</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Your account information (name, email, hashed password)</li>
                            <li>Payment transaction records (amount, date, Stripe transaction ID)</li>
                            <li>Session tokens for authentication</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4">What We Do NOT Store:</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Your uploaded CSV/Excel files</li>
                            <li>The email addresses or contact data in your files</li>
                            <li>Your cleaned/processed output files</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">4. Legal Basis for Processing (GDPR)</h2>
                        <p className="text-gray-700 mb-4">If you are in the EEA, our legal basis for processing your information includes:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Contract Performance:</strong> Processing necessary to provide the Service you requested.</li>
                            <li><strong>Legitimate Interests:</strong> Processing for fraud prevention, security, and service improvement.</li>
                            <li><strong>Consent:</strong> Where you have given explicit consent (e.g., marketing communications).</li>
                            <li><strong>Legal Obligation:</strong> Processing required to comply with applicable laws.</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">5. Data Sharing & Disclosure</h2>
                        <p className="text-gray-700 mb-4">We do not sell your personal information. We may share information with:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Service Providers:</strong> Third parties who perform services on our behalf:
                                <ul className="list-disc list-inside ml-6 mt-2">
                                    <li>Stripe (payment processing)</li>
                                    <li>Supabase (authentication & database)</li>
                                    <li>Cloudflare (hosting & security)</li>
                                </ul>
                            </li>
                            <li><strong>Legal Requirements:</strong> When required by law, court order, or government request.</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
                            <li><strong>Protection of Rights:</strong> To protect the rights, property, or safety of us, our users, or others.</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">6. Cookies & Tracking</h2>
                        <p className="text-gray-700 mb-4">We use the following types of cookies:</p>
                        <table className="w-full border-collapse border border-gray-300 mb-4">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Cookie Type</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Essential</td>
                                    <td className="border border-gray-300 px-4 py-2">Authentication, session management</td>
                                    <td className="border border-gray-300 px-4 py-2">Session</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Functional</td>
                                    <td className="border border-gray-300 px-4 py-2">Remember preferences</td>
                                    <td className="border border-gray-300 px-4 py-2">1 year</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Analytics</td>
                                    <td className="border border-gray-300 px-4 py-2">Usage statistics (anonymized)</td>
                                    <td className="border border-gray-300 px-4 py-2">2 years</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-gray-700">
                            You can control cookies through your browser settings. Disabling essential cookies may affect Service functionality.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Account Data:</strong> Retained until you delete your account.</li>
                            <li><strong>Payment Records:</strong> Retained for 7 years for tax and legal compliance.</li>
                            <li><strong>Log Data:</strong> Retained for 90 days, then automatically deleted.</li>
                            <li><strong>Uploaded Files:</strong> Not retained - processed in your browser only.</li>
                        </ul>
                    </section>

                    {/* Section 8 - GDPR Rights */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <UserCheck className="w-5 h-5" />
                            8. Your Rights (GDPR & CCPA)
                        </h2>
                        <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Right of Access</h4>
                                <p className="text-gray-600 text-sm">Request a copy of your personal data we hold.</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Right to Rectification</h4>
                                <p className="text-gray-600 text-sm">Request correction of inaccurate data.</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Right to Erasure</h4>
                                <p className="text-gray-600 text-sm">Request deletion of your personal data ("right to be forgotten").</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Right to Portability</h4>
                                <p className="text-gray-600 text-sm">Receive your data in a machine-readable format.</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Right to Object</h4>
                                <p className="text-gray-600 text-sm">Object to processing based on legitimate interests.</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Right to Restrict</h4>
                                <p className="text-gray-600 text-sm">Request limitation of processing in certain circumstances.</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mt-4">
                            To exercise these rights, contact us at <a href={`mailto:${companyEmail}`} className="text-indigo-600 hover:underline">{companyEmail}</a>. We will respond within 30 days.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            9. Security
                        </h2>
                        <p className="text-gray-700 mb-4">We implement appropriate technical and organizational measures to protect your data:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>TLS/SSL encryption for all data in transit</li>
                            <li>Encrypted database storage</li>
                            <li>Secure authentication with hashed passwords</li>
                            <li>Regular security audits and updates</li>
                            <li>Access controls and employee training</li>
                        </ul>
                    </section>

                    {/* Section 10 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
                        <p className="text-gray-700">
                            Our servers are located in the United States. If you are accessing the Service from outside the US, please be aware that your information may be transferred to, stored, and processed in the US. By using the Service, you consent to this transfer. For EU users, we rely on Standard Contractual Clauses (SCCs) approved by the European Commission to ensure adequate protection.
                        </p>
                    </section>

                    {/* Section 11 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">11. Children's Privacy</h2>
                        <p className="text-gray-700">
                            The Service is not intended for individuals under 16 years of age. We do not knowingly collect personal information from children. If we learn we have collected data from a child under 16, we will delete it promptly.
                        </p>
                    </section>

                    {/* Section 12 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">12. Changes to This Policy</h2>
                        <p className="text-gray-700">
                            We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the revised policy.
                        </p>
                    </section>

                    {/* Section 13 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
                        <p className="text-gray-700 mb-4">
                            If you have questions about this Privacy Policy or wish to exercise your rights, contact us:
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
                            <Link to="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link> • {' '}
                            <Link to="/acceptable-use" className="text-indigo-600 hover:underline">Acceptable Use Policy</Link> • {' '}
                            <Link to="/cookies" className="text-indigo-600 hover:underline">Cookie Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;