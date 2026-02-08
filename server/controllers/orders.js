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

const getOrdersByUserId = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const skip = (page - 1) * pageSize;
    const { data, totalCount} = await orderService.getOrders({ userId: req.user.id, skip, take: pageSize});
    return res.status(200).json({
      success: true,
      data,
      totalCount
    });
  } catch (err) {
      return errorHandler(err, res);
  }
};



export default {
  createOrder,
  getOrdersByUserId
};
