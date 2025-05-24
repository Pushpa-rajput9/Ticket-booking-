// App.js or RazorpayDemo.js
import React from "react";

const RazorpayDemo = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayClick = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag", // ✅ Razorpay's official test key — no login needed
      amount: 10000, // 10000 paise = ₹100
      currency: "INR",
      name: "Demo Corp",
      description: "Test Transaction",
      image: "https://razorpay.com/logo.svg", // Optional
      handler: function (response) {
        alert("✅ Payment Successful!");
        console.log("Payment ID:", response.razorpay_payment_id);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Test Address",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4 font-semibold">Razorpay Test Payment</h2>
      <button
        onClick={handlePayClick}
        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
      >
        Pay ₹100
      </button>
    </div>
  );
};

export default RazorpayDemo;
