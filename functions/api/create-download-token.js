// functions/api/create-download-token.js

// Handle CORS preflight requests
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
        },
    });
}

export async function onRequestPost(context) {
    const stripe = require('stripe')(context.env.STRIPE_SECRET_KEY);

    // Standard CORS headers for all responses
    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const { fileCount } = await context.request.json();

        // Validate fileCount
        if (!fileCount || typeof fileCount !== 'number' || fileCount < 1 || fileCount > 20) {
            return new Response(JSON.stringify({
                error: 'Invalid file count. Must be between 1 and 20.'
            }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        // Calculate price: $5.99 per file
        const amount = Math.round(fileCount * 5.99 * 100); // cents

        const origin = new URL(context.request.url).origin;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Email List Cleaner - ${fileCount} file${fileCount > 1 ? 's' : ''}`,
                            description: `Process and clean ${fileCount} CSV file${fileCount > 1 ? 's' : ''} with email validation, deduplication, and name extraction`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                fileCount: fileCount.toString(),
                product: 'csv-cleaner',
                pricePerFile: '5.99'
            },
            success_url: `${origin}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}?payment=canceled`,
        });

        return new Response(JSON.stringify({
            url: session.url,
            sessionId: session.id
        }), {
            status: 200,
            headers: corsHeaders,
        });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        return new Response(JSON.stringify({
            error: 'Payment processing failed. Please try again.',
            details: error.message
        }), {
            status: 500,
            headers: corsHeaders,
        });
    }
}