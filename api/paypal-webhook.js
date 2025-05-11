export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Log the webhook payload for debugging
    console.log("PayPal Webhook Received:", req.body);

    // Verify webhook authenticity (we'll add this later)

    // Handle different PayPal event types
    const eventType = req.body.event_type;

    switch (eventType) {
      case "PAYMENT.CAPTURE.COMPLETED":
        // Payment was successful
        const paymentData = req.body.resource;
        console.log("Payment completed:", paymentData);
        // Add your business logic here (e.g., update database)
        break;

      case "PAYMENT.CAPTURE.DENIED":
        console.log("Payment denied:", req.body.resource);
        break;

      default:
        console.log("Unhandled event type:", eventType);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: error.message });
  }
}
