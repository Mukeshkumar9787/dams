import { PAYMENT_TIMEOUT_SECONDS } from "./constants";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = process.env.NEXT_PUBLIC_RAZORPAY_CHECKOUT_LINK;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};


export const handlePayment = async (payment, callBack) => {
    try {
      const isLoaded = await loadRazorpayScript();

      if (!isLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: payment.amount,
        currency: payment.currency,
        name: payment?.compInfo?.name || '',
        description: payment?.compInfo?.name || '',
        order_id: payment.id,
        timeout: PAYMENT_TIMEOUT_SECONDS,
        handler: callBack,
        prefill: {
          name: payment.name,
          email: payment.email,
          contact: payment.mobile,
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      alert("Payment Failed ❌");
    }
  };