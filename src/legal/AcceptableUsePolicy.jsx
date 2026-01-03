import React from 'react';
import { ShieldAlert, ArrowLeft, Ban, AlertTriangle, Mail, Scale, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

const AcceptableUsePolicy = () => {
    const lastUpdated = "January 3, 2026";
    const companyName = "CSV Cleaner";
    const companyEmail = "abuse@csvcleaner.online";
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
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <ShieldAlert className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Acceptable Use Policy</h1>
                            <p className="text-gray-500">Last updated: {lastUpdated}</p>
                        </div>
                    </div>

                    {/* Introduction */}
                    <section className="mb-8">
                        <p className="text-gray-700 leading-relaxed">
                            This Acceptable Use Policy ("AUP") governs your use of the {companyName} service at {companyWebsite} (the "Service"). This AUP is incorporated into and forms part of our Terms of Service. By using the Service, you agree to comply with this policy.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            We reserve the right to modify this AUP at any time. Continued use of the Service after changes constitutes acceptance of the modified policy.
                        </p>
                    </section>

                    {/* Purpose */}
                    <section className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                        <h2 className="text-lg font-bold text-blue-900 mb-2">Purpose of This Policy</h2>
                        <p className="text-blue-800">
                            {companyName} is designed to help legitimate businesses and individuals clean and organize their email contact lists. This policy ensures the Service is used responsibly and legally, protecting both our users and the recipients of their email communications.
                        </p>
                    </section>

                    {/* Section 1 - Permitted Uses */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-green-700">✓ Permitted Uses</h2>
                        <p className="text-gray-700 mb-4">You may use the Service to:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Clean and deduplicate email lists you own or have permission to process</li>
                            <li>Validate email formats for your legitimate business contacts</li>
                            <li>Organize and standardize contact data for CRM systems</li>
                            <li>Prepare opt-in email lists for permission-based marketing</li>
                            <li>Process customer data in compliance with applicable privacy laws</li>
                            <li>Remove invalid or duplicate entries from your databases</li>
                            <li>Extract and standardize name fields for personalization</li>
                        </ul>
                    </section>

                    {/* Section 2 - Prohibited Content */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Ban className="w-5 h-5 text-red-600" />
                            Prohibited Content
                        </h2>
                        <p className="text-gray-700 mb-4">You may not process files containing:</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h4 className="font-semibold text-red-800 mb-2">Illegal Content</h4>
                                <ul className="text-red-700 text-sm space-y-1">
                                    <li>• Stolen or illegally obtained data</li>
                                    <li>• Data obtained through hacking or scraping without consent</li>
                                    <li>• Pirated or counterfeit materials</li>
                                    <li>• Content violating intellectual property rights</li>
                                </ul>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h4 className="font-semibold text-red-800 mb-2">Harmful Content</h4>
                                <ul className="text-red-700 text-sm space-y-1">
                                    <li>• Malware, viruses, or malicious code</li>
                                    <li>• Phishing or fraud-related data</li>
                                    <li>• Data intended for harassment or stalking</li>
                                    <li>• Content promoting violence or hate</li>
                                </ul>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h4 className="font-semibold text-red-800 mb-2">Sensitive Personal Data</h4>
                                <ul className="text-red-700 text-sm space-y-1">
                                    <li>• Health or medical information (unless HIPAA compliant)</li>
                                    <li>• Financial account numbers or SSNs</li>
                                    <li>• Children's personal information (under 16)</li>
                                    <li>• Biometric or genetic data</li>
                                </ul>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h4 className="font-semibold text-red-800 mb-2">Purchased/Harvested Lists</h4>
                                <ul className="text-red-700 text-sm space-y-1">
                                    <li>• Purchased email lists from third parties</li>
                                    <li>• Scraped or harvested email addresses</li>
                                    <li>• Lists without proper consent documentation</li>
                                    <li>• Rented or borrowed contact lists</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 - Email Marketing Compliance */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Email Marketing Compliance
                        </h2>
                        <p className="text-gray-700 mb-4">
                            If you use cleaned lists for email marketing, you must comply with all applicable anti-spam laws:
                        </p>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">🇺🇸 CAN-SPAM Act (United States)</h4>
                                <ul className="text-gray-700 text-sm space-y-1">
                                    <li>• Don't use false or misleading header information</li>
                                    <li>• Don't use deceptive subject lines</li>
                                    <li>• Identify the message as an advertisement</li>
                                    <li>• Include your physical postal address</li>
                                    <li>• Provide a clear opt-out mechanism</li>
                                    <li>• Honor opt-out requests within 10 business days</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">🇪🇺 GDPR (European Union)</h4>
                                <ul className="text-gray-700 text-sm space-y-1">
                                    <li>• Obtain explicit consent before sending marketing emails</li>
                                    <li>• Provide clear privacy information at point of collection</li>
                                    <li>• Allow users to easily withdraw consent</li>
                                    <li>• Maintain records of consent</li>
                                    <li>• Respond to data subject requests within 30 days</li>
                                    <li>• Report data breaches within 72 hours</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">🇨🇦 CASL (Canada)</h4>
                                <ul className="text-gray-700 text-sm space-y-1">
                                    <li>• Obtain express or implied consent before sending</li>
                                    <li>• Clearly identify yourself in messages</li>
                                    <li>• Provide contact information</li>
                                    <li>• Include a working unsubscribe mechanism</li>
                                    <li>• Process unsubscribe requests within 10 days</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">🇬🇧 UK PECR & UK GDPR</h4>
                                <ul className="text-gray-700 text-sm space-y-1">
                                    <li>• Similar requirements to EU GDPR</li>
                                    <li>• Consent required for marketing to individuals</li>
                                    <li>• Soft opt-in available for existing customers (limited)</li>
                                    <li>• Clear identification and opt-out in every message</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 - Prohibited Activities */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            Prohibited Activities
                        </h2>
                        <p className="text-gray-700 mb-4">You may NOT use the Service to:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Send Spam:</strong> Unsolicited bulk email to recipients who haven't opted in</li>
                            <li><strong>Phishing:</strong> Prepare lists for deceptive or fraudulent communications</li>
                            <li><strong>Spoofing:</strong> Create lists to impersonate others or forge sender information</li>
                            <li><strong>Harassment:</strong> Target individuals with unwanted communications</li>
                            <li><strong>Circumvent Laws:</strong> Evade anti-spam laws or privacy regulations</li>
                            <li><strong>Distribute Malware:</strong> Prepare lists for malware distribution campaigns</li>
                            <li><strong>Political Manipulation:</strong> Spread misinformation or interfere with elections</li>
                            <li><strong>Abuse Our Systems:</strong> Overload, attack, or interfere with our infrastructure</li>
                            <li><strong>Resell Service:</strong> Operate as an email list cleaning service using our platform</li>
                            <li><strong>Automate Access:</strong> Use bots, scrapers, or automated tools without permission</li>
                            <li><strong>Reverse Engineer:</strong> Attempt to decompile, disassemble, or hack the Service</li>
                        </ul>
                    </section>

                    {/* Section 5 - Your Responsibilities */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Responsibilities</h2>
                        <p className="text-gray-700 mb-4">By using the Service, you represent and warrant that:</p>
                        <ol className="list-decimal list-inside text-gray-700 space-y-3">
                            <li>
                                <strong>Lawful Collection:</strong> All data you process was collected lawfully with appropriate consent where required.
                            </li>
                            <li>
                                <strong>Right to Process:</strong> You have the legal right to process the data, either as the data owner or authorized processor.
                            </li>
                            <li>
                                <strong>Compliance:</strong> Your use of processed data will comply with all applicable laws, including privacy, anti-spam, and consumer protection laws.
                            </li>
                            <li>
                                <strong>Consent Records:</strong> You maintain appropriate records of consent for any personal data processed.
                            </li>
                            <li>
                                <strong>Security:</strong> You will implement appropriate security measures to protect processed data.
                            </li>
                            <li>
                                <strong>Honoring Rights:</strong> You will honor opt-out requests and data subject rights as required by law.
                            </li>
                        </ol>
                    </section>

                    {/* Section 6 - Enforcement */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Scale className="w-5 h-5" />
                            Enforcement
                        </h2>
                        <p className="text-gray-700 mb-4">
                            We take violations of this policy seriously. Enforcement actions may include:
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <span className="text-yellow-600 font-bold">1.</span>
                                <div>
                                    <p className="font-semibold text-yellow-800">Warning</p>
                                    <p className="text-yellow-700 text-sm">First-time or minor violations may result in a warning and request for corrective action.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <span className="text-orange-600 font-bold">2.</span>
                                <div>
                                    <p className="font-semibold text-orange-800">Suspension</p>
                                    <p className="text-orange-700 text-sm">Repeated or serious violations may result in temporary suspension of your account.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                <span className="text-red-600 font-bold">3.</span>
                                <div>
                                    <p className="font-semibold text-red-800">Termination</p>
                                    <p className="text-red-700 text-sm">Severe or repeated violations will result in permanent termination without refund.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                <span className="text-purple-600 font-bold">4.</span>
                                <div>
                                    <p className="font-semibold text-purple-800">Legal Action</p>
                                    <p className="text-purple-700 text-sm">Illegal activity may be reported to law enforcement and may result in civil or criminal liability.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 7 - Reporting */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Flag className="w-5 h-5" />
                            Reporting Violations
                        </h2>
                        <p className="text-gray-700 mb-4">
                            If you become aware of any violation of this Acceptable Use Policy, please report it to us immediately:
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700"><strong>Email:</strong> <a href={`mailto:${companyEmail}`} className="text-indigo-600 hover:underline">{companyEmail}</a></p>
                            <p className="text-gray-700 mt-2">
                                Please include as much detail as possible, including any evidence of the violation. We will investigate all credible reports and take appropriate action.
                            </p>
                        </div>
                    </section>

                    {/* Section 8 - No Liability */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Disclaimer</h2>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <p className="text-gray-700">
                                {companyName} is a tool for data processing. We do not monitor or control how you use the data you process. <strong>You are solely responsible</strong> for ensuring your use of the Service and any resulting email communications comply with all applicable laws and regulations. We disclaim all liability for your actions with processed data.
                            </p>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Questions?</h2>
                        <p className="text-gray-700">
                            If you have questions about this Acceptable Use Policy or need clarification on whether a particular use is permitted, contact us at <a href={`mailto:${companyEmail}`} className="text-indigo-600 hover:underline">{companyEmail}</a> before proceeding.
                        </p>
                    </section>

                    {/* Footer Links */}
                    <div className="border-t border-gray-200 pt-6 mt-8">
                        <p className="text-gray-600 text-sm">
                            Related policies: {' '}
                            <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link> • {' '}
                            <Link to="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link> • {' '}
                            <Link to="/cookies" className="text-indigo-600 hover:underline">Cookie Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcceptableUsePolicy;