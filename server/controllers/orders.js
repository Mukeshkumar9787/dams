import { errorHandler } from "../utils/errorHandler.js";
import orderService from "../services/orders.js"

const createOrder = async (req, res) => {
  try {
    const data = await orderService.createOrder({...req.body, userId: req.user.id});
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
      return errorHandler(err, res);
  }
};



export default {
  createOrder
};
