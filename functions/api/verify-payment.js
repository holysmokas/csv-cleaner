// functions/api/verify-payment.js

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
        const { session_id } = await context.request.json();

        // Validate session_id
        if (!session_id || typeof session_id !== 'string') {
            return new Response(JSON.stringify({
                error: 'Invalid session ID',
                paid: false
            }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        // Check payment status
        const isPaid = session.payment_status === 'paid';

        return new Response(JSON.stringify({
            paid: isPaid,
            email: session.customer_details?.email || null,
            fileCount: parseInt(session.metadata?.fileCount || '1', 10),
            amountPaid: session.amount_total ? (session.amount_total / 100).toFixed(2) : null,
            currency: session.currency || 'usd',
            paymentStatus: session.payment_status,
            // Include session ID for reference
            sessionId: session.id
        }), {
            status: 200,
            headers: corsHeaders,
        });
    } catch (error) {
        console.error('Payment verification error:', error);

        // Check if it's a Stripe-specific error
        const isStripeError = error.type && error.type.startsWith('Stripe');

        return new Response(JSON.stringify({
            error: isStripeError ? 'Invalid payment session' : 'Verification failed',
            paid: false,
            details: error.message
        }), {
            status: isStripeError ? 400 : 500,
            headers: corsHeaders,
        });
    }
}