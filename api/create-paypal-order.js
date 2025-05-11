// api/create-paypal-order.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { userId } = req.body;

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  // Get an access token
  const tokenRes = await fetch('https://api.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return res.status(500).json({ error: 'Failed to get access token' });
  }

  // Create the PayPal order
  const orderRes = await fetch('https://api.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '4.99',
          },
          custom_id: userId,
        },
      ],
    }),
  });

  const orderData = await orderRes.json();

  if (!orderData.id) {
    return res.status(500).json({ error: 'Failed to create order' });
  }

  res.status(200).json({ orderId: orderData.id });
}
