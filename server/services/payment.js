// razorpay.js
import Razorpay from "razorpay";

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const createPayment = async ({ amount }) => {
    try {
      const options = {
        amount: amount * 100, // convert to paisa
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };
      const payment = await razorpayInstance.orders.create(options);
      return payment;
    } catch (error) {
      throw new Error("Failed to initialize payment")      
    }
}