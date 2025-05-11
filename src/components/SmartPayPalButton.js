import { useEffect, useRef, useState } from "react";
import { useUser } from "../UserContext";
import { supabase } from "../supabaseClient";
import Toast from "./Toast";

export default function SmartPayPalButton() {
  const { user } = useUser();
  const paypalRef = useRef();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const PAYPAL_CLIENT = process.env.REACT_APP_PAYPAL_CLIENT_ID;

  // Toast state
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  // Function to show toast
  const showToast = (message, type = "success", duration = 5000) => {
    setToast({
      isVisible: true,
      message,
      type,
      duration,
    });
  };

  // Function to hide toast
  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    // Add validation for required values
    if (!PAYPAL_CLIENT) {
      console.error("PayPal client ID is missing");
      setError("Configuration error");
      return;
    }

    // Only proceed if we have the container and user
    if (!paypalRef.current || !user?.id) {
      console.log("PayPal container or user not ready yet");
      return;
    }

    let isMounted = true;

    // Clean up any existing PayPal scripts
    const cleanupExistingScript = () => {
      const existingScript = document.querySelector(
        'script[src*="paypal.com/sdk/js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };

    try {
      cleanupExistingScript();

      // Create and load the PayPal script
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT}&currency=USD`;
      script.async = true;

      // Handle script load errors
      script.onerror = (err) => {
        console.error("PayPal script failed to load:", err);
        if (isMounted) {
          setError("Failed to load payment system");
          setPaymentStatus("error");
        }
      };

      // Handle script load
      script.onload = () => {
        if (!isMounted || !paypalRef.current) return;

        // Clear the container
        paypalRef.current.innerHTML = "";

        try {
          // Render the PayPal buttons
          window.paypal
            .Buttons({
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

                  // Show success toast
                  showToast(
                    "Payment successful! You now have access to the exam.",
                    "success",
                    3000
                  );
                } catch (error) {
                  console.error("Payment processing error:", error);
                  setPaymentStatus("error");

                  // Show error toast
                  showToast(
                    "There was a problem processing your payment. Please contact support if the issue persists.",
                    "error"
                  );
                }
              },
              onError: (err) => {
                console.error("PayPal error:", err);
                setPaymentStatus("error");

                // Show error toast
                showToast(
                  "PayPal encountered an error. Please try again later.",
                  "error"
                );
              },
            })
            .render(paypalRef.current);
        } catch (err) {
          console.error("PayPal render error:", err);
          setPaymentStatus("error");
          setError("Payment system initialization failed");
        }
      };

      // Append the script to the document
      document.body.appendChild(script);
    } catch (err) {
      console.error("Error setting up PayPal:", err);
      setPaymentStatus("error");
      setError("Payment setup failed");
    }

    // Return cleanup function
    return () => {
      isMounted = false;
      if (paypalRef.current) {
        paypalRef.current.innerHTML = "";
      }
      cleanupExistingScript();
    };
  }, [user?.id, PAYPAL_CLIENT]);

  if (error) {
    return (
      <div className="mt-4">
        <div className="text-red-500">
          {error}. Please refresh the page or contact support.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div ref={paypalRef} style={{ minHeight: "150px" }}></div>

      {/* Payment status indicator */}
      {paymentStatus === "processing" && (
        <div className="text-blue-500 mt-2">Processing payment...</div>
      )}

      {/* Toast notification */}
      <Toast
        isVisible={toast.isVisible}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
      />
    </div>
  );
}
