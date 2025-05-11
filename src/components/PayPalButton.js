// // src/components/PayPalButton.js
// import { useEffect, useState } from "react";

// export default function PayPalButton({ hostedButtonId }) {
//   const [isScriptLoaded, setIsScriptLoaded] = useState(false);
//   const containerId = `paypal-container-${hostedButtonId}`;
//   const PAYPAL_CLIENT = process.env.REACT_PAYPAL_CLIENT_ID;
//   useEffect(() => {
//     const loadPayPalScript = () => {
//       return new Promise((resolve, reject) => {
//         const script = document.createElement("script");
//         script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT}&components=hosted-buttons`;
//         script.id = "paypal-sdk";
//         script.async = true;
//         script.onload = () => {
//           setIsScriptLoaded(true);
//           resolve();
//         };
//         script.onerror = (err) => reject(err);
//         document.body.appendChild(script);
//       });
//     };

//     const renderButton = () => {
//       if (window.paypal) {
//         try {
//           window.paypal
//             .HostedButtons({ hostedButtonId })
//             .render(`#${containerId}`);
//         } catch (error) {
//           console.error("PayPal button render error:", error);
//         }
//       }
//     };

//     const existingScript = document.getElementById("paypal-sdk");

//     if (!existingScript) {
//       loadPayPalScript()
//         .then(renderButton)
//         .catch((error) => console.error("PayPal script loading error:", error));
//     } else if (!isScriptLoaded) {
//       setIsScriptLoaded(true);
//       renderButton();
//     } else {
//       renderButton();
//     }

//     // Cleanup function
//     return () => {
//       const container = document.getElementById(containerId);
//       if (container) {
//         container.innerHTML = "";
//       }
//     };
//   }, [hostedButtonId, containerId, isScriptLoaded]);

//   return <div id={containerId}></div>;
// }
