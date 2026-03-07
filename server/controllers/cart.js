import cartService from "../services/cart.js";
import { errorHandler } from "../utils/errorHandler.js";

const getCart = async (req, res) => {
  try {
    const data = await cartService.getCartByUserId(req.user.id);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const replaceCart = async (req, res) => {
  try {
    const data = await cartService.replaceCartByUserId(req.user.id, req.body.items);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default {
  getCart,
  replaceCart,
};
