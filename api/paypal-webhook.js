import crypto from "crypto";
import fetch from "node-fetch";
import supabase from "./supabaseAdmin";

// Update these environment variable names
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID; // Remove REACT_APP_ prefix
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Make sure BASE_URL is correctly formatted
const BASE_URL = "https://api-m.sandbox.paypal.com"; // Remove trailing slash

async function verifyPayPalWebhook(req) {
  try {
    // Get PayPal webhook transmission ID and timestamp from headers
    const transmissionId = req.headers["paypal-transmission-id"];
    const transmissionTime = req.headers["paypal-transmission-time"];
    const certUrl = req.headers["paypal-cert-url"];
    const authAlgo = req.headers["paypal-auth-algo"];
    const transmissionSig = req.headers["paypal-transmission-sig"];

    // Get the webhook body as a raw string
    const webhookBody = JSON.stringify(req.body);

    // Construct the verification message
    const verificationMessage =
      transmissionId +
      "|" +
      transmissionTime +
      "|" +
      PAYPAL_WEBHOOK_ID +
      "|" +
      crypto.createHash("sha256").update(webhookBody).digest("hex");

    // Log verification details
    console.log("🔐 Verifying webhook with following details:");
    console.log("Transmission ID:", transmissionId);
    console.log("Webhook ID:", PAYPAL_WEBHOOK_ID);

    // Get access token
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");
    const tokenResponse = await fetch(`${BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const { access_token } = await tokenResponse.json();

    // Verify webhook signature
    const verifyResponse = await fetch(
      `${BASE_URL}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transmission_id: transmissionId,
          transmission_time: transmissionTime,
          cert_url: certUrl,
          auth_algo: authAlgo,
          transmission_sig: transmissionSig,
          webhook_id: PAYPAL_WEBHOOK_ID,
          webhook_event: req.body,
        }),
      }
    );

    const verificationResult = await verifyResponse.json();
    return verificationResult.verification_status === "SUCCESS";
  } catch (error) {
    console.error("❌ Webhook verification failed:", error);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log("❌ Invalid request method:", req.method);
    return res.status(405).send("Method Not Allowed");
  }

  // Log all headers to debug
  console.log("Incoming Headers:", req.headers);

  // Check if all required headers are present
  const requiredHeaders = [
    "paypal-transmission-id",
    "paypal-transmission-time",
    "paypal-cert-url",
    "paypal-auth-algo",
    "paypal-transmission-sig",
  ];

  const missingHeaders = requiredHeaders.filter(
    (header) => !req.headers[header]
  );
  if (missingHeaders.length > 0) {
    console.log("❌ Missing required headers:", missingHeaders);
    return res.status(400).json({
      error: `Missing required headers: ${missingHeaders.join(", ")}`,
    });
  }

  try {
    // Verify the webhook signature
    const isVerified = await verifyPayPalWebhook(req);
    if (!isVerified) {
      console.log("❌ Webhook verification failed");
      return res.status(400).json({ error: "Webhook verification failed" });
    }

    const event = req.body;
    console.log("📦 Received PayPal webhook:", event.event_type);
    console.log("📦 Full webhook payload:", JSON.stringify(event, null, 2));

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const captureId = event.resource.id;
      const paymentStatus = event.resource.status;
      const customId = event.resource.custom_id;

      console.log("✅ Payment captured successfully!");
      console.log("📊 Capture ID:", captureId);
      console.log("📊 Payment Status:", paymentStatus);
      console.log("📊 Custom ID:", customId);

      let userId = null;
      if (event.resource && event.resource.custom_id) {
        userId = event.resource.custom_id;
      }

      if (userId) {
        console.log("✅ Found user ID:", userId);
      } else {
        console.log("❌ Could not find user ID in payload");
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
