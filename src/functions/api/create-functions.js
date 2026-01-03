export async function onRequestPost(context) {
    const stripe = require('stripe')(context.env.STRIPE_SECRET_KEY);

    try {
        const { plan } = await context.request.json();

        const prices = {
            single: { amount: 799, name: 'Single File' },
            small: { amount: 2999, name: 'Small Pack (5 files)' },
            large: { amount: 9999, name: 'Large Pack (20 files)' }
        };

        const selectedPrice = prices[plan];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: selectedPrice.name,
                            description: 'CSV Email List Cleaner',
                        },
                        unit_amount: selectedPrice.amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${context.request.headers.get('origin')}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${context.request.headers.get('origin')}?payment=canceled`,
        });

        return new Response(JSON.stringify({ url: session.url }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}