export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const body = req.body;

    // Log the event (you can later add validation using PayPal's verification API)
    console.log('Received PayPal webhook:', body);

    // Example: Check if it's a completed payment
    if (
      body.event_type === 'CHECKOUT.ORDER.APPROVED' ||
      body.event_type === 'PAYMENT.CAPTURE.COMPLETED'
    ) {
      const userEmail = body.resource.payer.email_address;
      const examId = body.resource.custom_id || null; // Optional, if you pass it during PayPal setup

      // TODO: Add Supabase logic here to grant access
      console.log(`Grant access to ${userEmail} for ${examId}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling PayPal webhook:', error);
    res.status(500).send('Webhook handler failed');
  }
}
