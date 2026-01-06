// functions/api/user-signup-webhook.js
// This webhook is called after a user signs up to:
// 1. Send you an email notification
// 2. Add the user to Google Sheets

// Handle CORS preflight requests
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    });
}

export async function onRequestPost(context) {
    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const { name, email, timestamp } = await context.request.json();

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        const signupTime = timestamp || new Date().toISOString();
        const results = { emailSent: false, sheetUpdated: false };

        // 1. Send email notification via Resend
        if (context.env.RESEND_API_KEY) {
            try {
                const emailResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: 'CSV Cleaner <noreply@csvcleaner.online>',
                        to: ['contact@holysmokas.com'],
                        subject: `🎉 New CSV Cleaner Signup: ${name || email}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #4F46E5;">New User Signup!</h2>
                                <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                    <p><strong>Name:</strong> ${name || 'Not provided'}</p>
                                    <p><strong>Email:</strong> ${email}</p>
                                    <p><strong>Signed up:</strong> ${new Date(signupTime).toLocaleString('en-US', {
                            timeZone: 'America/New_York',
                            dateStyle: 'full',
                            timeStyle: 'short'
                        })}</p>
                                </div>
                                <p style="color: #6B7280; font-size: 14px;">
                                    This is an automated notification from CSV Cleaner.
                                </p>
                            </div>
                        `,
                    }),
                });

                if (emailResponse.ok) {
                    results.emailSent = true;
                    console.log('Signup notification email sent');
                } else {
                    const errorData = await emailResponse.json();
                    console.error('Email send failed:', errorData);
                }
            } catch (emailError) {
                console.error('Email error:', emailError);
            }
        }

        // 2. Add to Google Sheets via Google Sheets API
        if (context.env.GOOGLE_SHEETS_WEBHOOK_URL) {
            try {
                const sheetResponse = await fetch(context.env.GOOGLE_SHEETS_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name || '',
                        email: email,
                        signupDate: signupTime,
                        source: 'CSV Cleaner'
                    }),
                });

                if (sheetResponse.ok) {
                    results.sheetUpdated = true;
                    console.log('Google Sheet updated');
                } else {
                    console.error('Sheet update failed:', await sheetResponse.text());
                }
            } catch (sheetError) {
                console.error('Sheet error:', sheetError);
            }
        }

        // Alternative: Use Google Apps Script Web App URL
        if (context.env.GOOGLE_APPS_SCRIPT_URL) {
            try {
                const scriptResponse = await fetch(context.env.GOOGLE_APPS_SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name || '',
                        email: email,
                        signupDate: signupTime,
                        source: 'CSV Cleaner'
                    }),
                });

                if (scriptResponse.ok) {
                    results.sheetUpdated = true;
                    console.log('Google Sheet updated via Apps Script');
                }
            } catch (scriptError) {
                console.error('Apps Script error:', scriptError);
            }
        }

        return new Response(JSON.stringify({
            success: true,
            ...results
        }), {
            status: 200,
            headers: corsHeaders,
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return new Response(JSON.stringify({
            error: 'Webhook processing failed',
            details: error.message
        }), {
            status: 500,
            headers: corsHeaders,
        });
    }
}