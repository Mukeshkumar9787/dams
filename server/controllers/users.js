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

const getAll = async (req, res) => {
  try {
    const { users, totalCount} = await userService.getAll(req.query);
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
      totalCount
    });
  } catch (err) {
      return errorHandler(err, res);
  }
};

const changeRole = async (req, res) => {
  try {
    const { userId } = req.body;
    if(userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role"
      });
    }
    const user = await userService.changeRole({ id: userId, role: req.body.role});
    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: user
    });
  } catch (err) {
      return errorHandler(err, res);
  }
};


// Export as default object for easier import in routes
export default {
  getUserInfo,
  updateProfile,
  getAll,
  changeRole
};
