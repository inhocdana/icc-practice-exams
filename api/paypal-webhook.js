import supabase from "./supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log("❌ Invalid request method:", req.method);
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const event = req.body;

    // Log the entire payload to understand its structure
    console.log("📦 Full webhook payload:", JSON.stringify(event, null, 2));

    // For PAYMENT.CAPTURE.COMPLETED events, the structure is typically:
    // event.resource.purchase_units[0].custom_id

    // For CHECKOUT.ORDER.APPROVED events, it might be:
    // event.resource.purchase_units[0].custom_id

    let userId = null;

    // Try different paths based on event type
    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      // For payment capture events
      if (event.resource && event.resource.custom_id) {
        userId = event.resource.custom_id;
      } else if (
        event.resource &&
        event.resource.purchase_units &&
        event.resource.purchase_units[0] &&
        event.resource.purchase_units[0].custom_id
      ) {
        userId = event.resource.purchase_units[0].custom_id;
      }
    } else if (event.event_type === "CHECKOUT.ORDER.APPROVED") {
      // For order approved events
      if (
        event.resource &&
        event.resource.purchase_units &&
        event.resource.purchase_units[0] &&
        event.resource.purchase_units[0].custom_id
      ) {
        userId = event.resource.purchase_units[0].custom_id;
      }
    }

    // Log what we found (or didn't find)
    if (userId) {
      console.log("✅ Found user ID:", userId);
    } else {
      console.log("❌ Could not find user ID in payload");
      // Log the resource part to help debug
      console.log(
        "🔍 Resource structure:",
        JSON.stringify(event.resource, null, 2)
      );
      return res
        .status(200)
        .json({ success: false, error: "User ID not found" });
    }

    // Check for existing user
    const { data: existing, error: fetchError } = await supabase
      .from("exam_access")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("❌ Supabase lookup error:", fetchError.message);
      return res.status(500).json({ error: fetchError.message });
    }

    if (existing) {
      console.log("✅ User found, updating...");
      const { error: updateError } = await supabase
        .from("exam_access")
        .update({ ipmc2021_paid: true })
        .eq("user_id", userId);

      if (updateError) {
        console.error("❌ Update error:", updateError.message);
        return res.status(500).json({ error: updateError.message });
      }

      console.log("✅ Update successful");
      return res.status(200).json({ success: true, action: "updated" });
    } else {
      console.log("➕ User not found, inserting new row...");
      const { error: insertError } = await supabase
        .from("exam_access")
        .insert({ user_id: userId, ipmc2021_paid: true });

      if (insertError) {
        console.error("❌ Insert error:", insertError.message);
        return res.status(500).json({ error: insertError.message });
      }

      console.log("✅ Insert successful");
      return res.status(200).json({ success: true, action: "inserted" });
    }
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
