// functions/api/create-download-token.js
export async function onRequestPost(context) {
    const stripe = require('stripe')(context.env.STRIPE_SECRET_KEY);

    try {
        const { fileCount } = await context.request.json();

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
                            description: `Process ${fileCount} CSV file${fileCount > 1 ? 's' : ''}`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                fileCount: fileCount.toString()
            },
            success_url: `${origin}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}?payment=canceled`,
        });

        return new Response(JSON.stringify({ url: session.url }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });
    } catch (error) {
        console.error('Stripe error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}