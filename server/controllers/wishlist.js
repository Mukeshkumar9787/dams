import wishlistService from "../services/wishlist.js";
import { errorHandler } from "../utils/errorHandler.js";

const getWishlist = async (req, res) => {
  try {
    const data = await wishlistService.getWishlistByUserId(req.user.id);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const replaceWishlist = async (req, res) => {
  try {
    const data = await wishlistService.replaceWishlistByUserId(req.user.id, req.body.items);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default {
  getWishlist,
  replaceWishlist,
};
