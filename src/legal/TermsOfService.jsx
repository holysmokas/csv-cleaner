import React from 'react';
import { FileText, ArrowLeft, AlertTriangle, CreditCard, Scale, Ban, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    const lastUpdated = "January 3, 2026";
    const companyName = "CSV Cleaner";
    const companyEmail = "legal@csvcleaner.online";
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
                            <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
                            <p className="text-gray-500">Last updated: {lastUpdated}</p>
                        </div>
                    </div>

                    {/* Important Notice */}
                    <section className="mb-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
                        <h2 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Important Legal Notice
                        </h2>
                        <p className="text-amber-800">
                            Please read these Terms of Service carefully before using {companyName}. By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
                        </p>
                    </section>

                    {/* Section 1 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
                        <p className="text-gray-700 mb-4">
                            These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and {companyName} ("Company," "we," "us," or "our") governing your access to and use of the {companyWebsite} website and CSV email list cleaning service (collectively, the "Service").
                        </p>
                        <p className="text-gray-700">
                            By creating an account, making a purchase, or otherwise using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and our Acceptable Use Policy.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                        <p className="text-gray-700 mb-4">
                            {companyName} provides an online tool that allows users to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                            <li>Upload CSV and Excel files containing contact information</li>
                            <li>Clean and validate email addresses</li>
                            <li>Remove duplicate entries</li>
                            <li>Extract names from email addresses</li>
                            <li>Edit and manage contact data</li>
                            <li>Download processed files</li>
                        </ul>
                        <p className="text-gray-700">
                            All file processing occurs locally in your web browser. Your files are not uploaded to or stored on our servers.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
                        <p className="text-gray-700 mb-4">To use certain features of the Service, you must create an account. You agree to:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Provide accurate, current, and complete information during registration</li>
                            <li>Maintain and promptly update your account information</li>
                            <li>Maintain the security of your password and account</li>
                            <li>Accept responsibility for all activities under your account</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                        </ul>
                        <p className="text-gray-700 mt-4">
                            We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our sole discretion.
                        </p>
                    </section>

                    {/* Section 4 - Payments */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            4. Payments and Pricing
                        </h2>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Pricing</h3>
                        <p className="text-gray-700 mb-4">
                            The Service operates on a pay-per-use model. Current pricing is $5.99 USD per file processed. Prices are subject to change with notice posted on our website.
                        </p>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Payment Processing</h3>
                        <p className="text-gray-700 mb-4">
                            All payments are processed securely through Stripe, Inc. By making a purchase, you agree to Stripe's terms of service. We do not store your complete credit card information.
                        </p>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">4.3 Refund Policy</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700 mb-2">
                                Due to the instant-delivery nature of our Service, <strong>all sales are final</strong>. However, we may provide refunds at our sole discretion in the following cases:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Technical errors that prevented file processing</li>
                                <li>Duplicate charges due to system errors</li>
                                <li>Service was completely unavailable after payment</li>
                            </ul>
                            <p className="text-gray-700 mt-2">
                                To request a refund, contact us at <a href={`mailto:${companyEmail}`} className="text-indigo-600 hover:underline">{companyEmail}</a> within 7 days of purchase with your transaction details.
                            </p>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4">4.4 Taxes</h3>
                        <p className="text-gray-700">
                            Prices do not include applicable taxes. You are responsible for paying all taxes associated with your purchases. We will collect taxes where required by law.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 Our Intellectual Property</h3>
                        <p className="text-gray-700 mb-4">
                            The Service, including its original content, features, functionality, design, and code, is owned by {companyName} and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Service without our express written permission.
                        </p>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 Your Content</h3>
                        <p className="text-gray-700">
                            You retain all rights to the data and files you process through the Service. Since files are processed locally in your browser and not uploaded to our servers, we do not claim any ownership or license to your content.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Ban className="w-5 h-5" />
                            6. Prohibited Uses
                        </h2>
                        <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Violate any applicable laws or regulations</li>
                            <li>Process data you do not have the right to use</li>
                            <li>Send spam or unsolicited communications using processed lists</li>
                            <li>Violate anti-spam laws (CAN-SPAM, GDPR, CASL, etc.)</li>
                            <li>Infringe on the intellectual property rights of others</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the Service or servers</li>
                            <li>Reverse engineer, decompile, or disassemble the Service</li>
                            <li>Use automated means to access the Service without permission</li>
                            <li>Resell or redistribute the Service without authorization</li>
                        </ul>
                        <p className="text-gray-700 mt-4">
                            For detailed prohibited uses, see our <Link to="/acceptable-use" className="text-indigo-600 hover:underline">Acceptable Use Policy</Link>.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">7. Disclaimer of Warranties</h2>
                        <div className="bg-gray-100 p-4 rounded-lg text-gray-700">
                            <p className="mb-4">
                                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                            </p>
                            <p className="mb-4">
                                WE DO NOT WARRANT THAT:
                            </p>
                            <ul className="list-disc list-inside space-y-1 mb-4">
                                <li>THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE</li>
                                <li>THE RESULTS OBTAINED FROM THE SERVICE WILL BE ACCURATE OR RELIABLE</li>
                                <li>THE QUALITY OF THE SERVICE WILL MEET YOUR EXPECTATIONS</li>
                                <li>ANY ERRORS IN THE SERVICE WILL BE CORRECTED</li>
                            </ul>
                            <p>
                                YOU USE THE SERVICE AT YOUR OWN RISK. WE ARE NOT RESPONSIBLE FOR THE ACCURACY, VALIDITY, OR DELIVERABILITY OF EMAIL ADDRESSES PROCESSED THROUGH THE SERVICE.
                            </p>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Scale className="w-5 h-5" />
                            8. Limitation of Liability
                        </h2>
                        <div className="bg-gray-100 p-4 rounded-lg text-gray-700">
                            <p className="mb-4">
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL {companyName.toUpperCase()}, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                            </p>
                            <ul className="list-disc list-inside space-y-1 mb-4">
                                <li>LOSS OF PROFITS, REVENUE, OR DATA</li>
                                <li>BUSINESS INTERRUPTION</li>
                                <li>COST OF SUBSTITUTE SERVICES</li>
                                <li>ANY DAMAGES RESULTING FROM YOUR USE OF THE SERVICE</li>
                            </ul>
                            <p>
                                OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR $100 USD, WHICHEVER IS GREATER.
                            </p>
                        </div>
                    </section>

                    {/* Section 9 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
                        <p className="text-gray-700">
                            You agree to indemnify, defend, and hold harmless {companyName} and its officers, directors, employees, agents, and affiliates from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from or related to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                            <li>Your use of the Service</li>
                            <li>Your violation of these Terms</li>
                            <li>Your violation of any third-party rights</li>
                            <li>Any content or data you process through the Service</li>
                            <li>Your violation of applicable laws or regulations</li>
                        </ul>
                    </section>

                    {/* Section 10 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">10. Termination</h2>
                        <p className="text-gray-700 mb-4">
                            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms.
                        </p>
                        <p className="text-gray-700 mb-4">
                            Upon termination:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Your right to use the Service will immediately cease</li>
                            <li>We may delete your account and associated data</li>
                            <li>Provisions that by their nature should survive termination will survive (including ownership, warranty disclaimers, indemnity, and limitations of liability)</li>
                        </ul>
                    </section>

                    {/* Section 11 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">11. Governing Law & Dispute Resolution</h2>
                        <p className="text-gray-700 mb-4">
                            These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
                        </p>
                        <p className="text-gray-700 mb-4">
                            Any dispute arising from or relating to these Terms or the Service shall be resolved through:
                        </p>
                        <ol className="list-decimal list-inside text-gray-700 space-y-2">
                            <li><strong>Informal Resolution:</strong> Contact us first to attempt to resolve the dispute informally.</li>
                            <li><strong>Binding Arbitration:</strong> If informal resolution fails, disputes will be resolved by binding arbitration under the rules of the American Arbitration Association.</li>
                            <li><strong>Class Action Waiver:</strong> You agree to resolve disputes individually and waive the right to participate in class actions.</li>
                        </ol>
                    </section>

                    {/* Section 12 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <RefreshCw className="w-5 h-5" />
                            12. Changes to Terms
                        </h2>
                        <p className="text-gray-700">
                            We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the Service after changes become effective constitutes acceptance of the revised Terms. If you do not agree to the new Terms, you must stop using the Service.
                        </p>
                    </section>

                    {/* Section 13 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">13. Miscellaneous</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy and Acceptable Use Policy, constitute the entire agreement between you and us.</li>
                            <li><strong>Severability:</strong> If any provision of these Terms is found invalid or unenforceable, the remaining provisions will remain in full effect.</li>
                            <li><strong>Waiver:</strong> Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</li>
                            <li><strong>Assignment:</strong> You may not assign or transfer these Terms without our prior written consent. We may assign our rights and obligations without restriction.</li>
                            <li><strong>Force Majeure:</strong> We shall not be liable for any failure to perform due to circumstances beyond our reasonable control.</li>
                        </ul>
                    </section>

                    {/* Section 14 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">14. Contact Us</h2>
                        <p className="text-gray-700 mb-4">
                            If you have questions about these Terms of Service, contact us:
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
                            <Link to="/acceptable-use" className="text-indigo-600 hover:underline">Acceptable Use Policy</Link> • {' '}
                            <Link to="/cookies" className="text-indigo-600 hover:underline">Cookie Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;