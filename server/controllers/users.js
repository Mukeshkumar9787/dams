import { errorHandler } from "../utils/errorHandler.js";

const getUserInfo = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (err) {
      return errorHandler(err, res);
  }
};


// Export as default object for easier import in routes
export default {
  getUserInfo
};
