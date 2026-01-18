import { errorHandler } from "../utils/errorHandler.js";
import userService from "../services/users.js"
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

const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (err) {
      return errorHandler(err, res);
  }
};


// Export as default object for easier import in routes
export default {
  getUserInfo,
  updateProfile
};
