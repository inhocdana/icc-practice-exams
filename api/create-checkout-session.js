const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { priceId, userId, examId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://www.iccpracticeexams.com/exams?success=true&examId=${examId}`,
      cancel_url: `https://www.iccpracticeexams.com/exams?canceled=true`,
      metadata: {
        userId,
        examId,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('❌ Stripe error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
