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
    const page = parseInt(req.query.page || 1);
    const pageSize = parseInt(req.query.pageSize || 5);
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

const getAdminOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const pageSize = req.query.pageSize || 10;
    const skip = (page - 1) * pageSize;
    const { data, totalCount} = await orderService.getOrders({ skip, take: pageSize});
    return res.status(200).json({
      success: true,
      data,
      totalCount
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getOrderBySlugAdmin = async (req, res) => {
  try {
    const data = await orderService.getOrder({ orderNo: req.params.slug });
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getOrderBySlugUser = async (req, res) => {
  try {
    const data = await orderService.getOrder({ orderNo: req.params.slug, userId: req.user.id });
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};



export default {
  createOrder,
  getOrdersByUserId,
  getAdminOrders,
  getOrderBySlugAdmin,
  getOrderBySlugUser
};
