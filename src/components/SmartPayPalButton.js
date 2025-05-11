import { useEffect, useRef, useState } from "react";
import { useUser } from "../UserContext";
import { supabase } from "../supabaseClient";

export default function SmartPayPalButton() {
  const { user } = useUser();
  const paypalRef = useRef();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const PAYPAL_CLIENT = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  useEffect(() => {
    // Only proceed if we have the container and user
    if (!paypalRef.current || !user?.id) return;

    // Clean up any existing PayPal scripts
    const existingScript = document.querySelector(
      'script[src*="paypal.com/sdk/js"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Create and load the PayPal script
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT}&currency=USD`;
    script.async = true;

    // Handle script load
    script.onload = () => {
      // Clear the container
      if (paypalRef.current) {
        paypalRef.current.innerHTML = "";
      }

      // Render the PayPal buttons
      window.paypal
        .Buttons({
          fundingSource: window.paypal.FUNDING.PAYPAL,
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              application_context: {
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
              },
              purchase_units: [
                {
                  amount: {
                    value: "4.99",
                  },
                  description: "IPMC 2021 Practice Exam",
                  custom_id: user.id,
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            try {
              setPaymentStatus("processing");

              // 1. Capture the PayPal order
              const order = await actions.order.capture();
              console.log("Payment successful:", order);

              // 2. Update Supabase directly
              const { data: existing, error: fetchError } = await supabase
                .from("exam_access")
                .select("id")
                .eq("user_id", user.id)
                .single();

              if (fetchError && fetchError.code !== "PGRST116") {
                console.error("Supabase lookup error:", fetchError);
                throw new Error("Database lookup failed");
              }

              // 3. Either update existing record or insert new one
              let dbResult;
              if (existing) {
                dbResult = await supabase
                  .from("exam_access")
                  .update({ ipmc2021_paid: true })
                  .eq("user_id", user.id);
              } else {
                dbResult = await supabase
                  .from("exam_access")
                  .insert({ user_id: user.id, ipmc2021_paid: true });
              }

              if (dbResult.error) {
                console.error("Database update error:", dbResult.error);
                throw new Error("Failed to update access permissions");
              }

              // 4. Update UI with success
              setPaymentStatus("success");
              alert("Payment successful! You now have access to the exam.");

              // 5. Optional: Refresh the page or update UI to show new access
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            } catch (error) {
              console.error("Payment processing error:", error);
              setPaymentStatus("error");
              alert(
                "There was a problem processing your payment. Please contact support if the issue persists."
              );
            }
          },
          onError: (err) => {
            console.error("PayPal error:", err);
            setPaymentStatus("error");
            alert("PayPal encountered an error. Please try again later.");
          },
        })
        .render(paypalRef.current);
    };

    // Append the script to the document
    document.body.appendChild(script);

    // Return cleanup function
    return () => {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = "";
      }
      const scriptToRemove = document.querySelector(
        'script[src*="paypal.com/sdk/js"]'
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [user?.id]); // Only re-run if user ID changes

  // Show payment status to the user
  const renderStatus = () => {
    if (paymentStatus === "processing") {
      return <div className="text-blue-500 mt-2">Processing payment...</div>;
    } else if (paymentStatus === "success") {
      return <div className="text-green-500 mt-2">Payment successful!</div>;
    } else if (paymentStatus === "error") {
      return (
        <div className="text-red-500 mt-2">
          Payment failed. Please try again.
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-4">
      <div ref={paypalRef} style={{ minHeight: "150px" }}></div>
      {renderStatus()}
    </div>
  );
}
