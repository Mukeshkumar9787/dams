import crypto from "crypto";
import orderService from "../services/orders.js"
import { ORDER_STATUS, STOCK_TYPES } from "../utils/constants.js";


export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;
  try {
  
    const body = razorpay_order_id + "|" + razorpay_payment_id;
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
  
    if (expectedSignature === razorpay_signature) {
      await orderService.updateOrderStatusByPaymentId({ paymentOrderId: razorpay_order_id, status: ORDER_STATUS.PLACED, stockStatus: STOCK_TYPES.ORDER});
      res.json({ success: true, message: "Payment verified" });
    } else {
      throw new Error("Signature not verified");
    }
  } catch (error) {
      await orderService.updateOrderStatusByPaymentId({ paymentOrderId: razorpay_order_id, status: ORDER_STATUS.PAYMENT_FAILED, stockStatus: STOCK_TYPES.WITHDRAW});
      res.status(400).json({ success: false, message: "Payment Failed" });
  }
};
