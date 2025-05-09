// /api/paypal-webhook.js
import { supabase } from '../../src/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const event = req.body;

    // Optional: Validate PayPal signature headers here (can add later)

    const eventType = event.event_type;

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const payerEmail = event.resource?.payer?.email_address;

      // Grant access in Supabase
      if (payerEmail) {
        const { data, error } = await supabase
          .from('exam_access')
          .insert([{ email: payerEmail, exam_id: 'ipmc2021' }]);

        if (error) {
          console.error('Supabase insert error:', error.message);
          return res.status(500).json({ error: 'Supabase insert failed' });
        }

        return res.status(200).json({ message: 'Access granted' });
      }
    }

    // Respond for all other event types
    res.status(200).json({ message: 'Event received' });

  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).send('Webhook Error');
  }
}
