// functions/api/create-checkout.js

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
        const { plan } = await context.request.json();

        // Define pricing plans
        const prices = {
            single: { amount: 799, name: 'Single File', files: 1 },
            small: { amount: 2999, name: 'Small Pack (5 files)', files: 5 },
            large: { amount: 9999, name: 'Large Pack (20 files)', files: 20 }
        };

        const selectedPrice = prices[plan];

        // Validate plan
        if (!selectedPrice) {
            return new Response(JSON.stringify({
                error: 'Invalid plan selected',
                validPlans: Object.keys(prices)
            }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        const origin = new URL(context.request.url).origin;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: selectedPrice.name,
                            description: 'CSV Email List Cleaner - Clean, deduplicate, and validate your email lists',
                        },
                        unit_amount: selectedPrice.amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                plan: plan,
                fileCount: selectedPrice.files.toString(),
                product: 'csv-cleaner'
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