export async function onRequestPost(context) {
    const stripe = require('stripe')(context.env.STRIPE_SECRET_KEY);

    try {
        const { session_id } = await context.request.json();

        const session = await stripe.checkout.sessions.retrieve(session_id);

        return new Response(JSON.stringify({
            paid: session.payment_status === 'paid',
            email: session.customer_details?.email,
            fileCount: parseInt(session.metadata?.fileCount || '1')
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });
    } catch (error) {
        console.error('Verification error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}