import { authService } from "../services/index.js";
import { errorHandler } from "../utils/errorHandler.js";

const register = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const result = await authService.register({
      name,
      email,
      password,
      mobile,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (err) {
      return errorHandler(err, res);
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);

    return res.status(200).json({
      success: true,
      message: "Otp sent successfully",
      data: result
    });
  } catch (err) {
      return errorHandler(err, res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (err) {
      return errorHandler(err, res);
  }
};

const loginWithOTP = async (req, res) => {
  try {
    const result = await authService.loginWithOTP(req.body);
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      data: result
    });
  } catch (err) {
      return errorHandler(err, res);
  }
};

const verifyOTP = async (req, res) => {
  try {
    const result = await authService.verifyOTP(req.body);
    return res.status(200).json({
      success: true,
      message: "Registered successfully",
      data: result
    });
  } catch (err) {
      return errorHandler(err, res);
  }
};


// Export as default object for easier import in routes
export default {
  register,
  login,
  verifyOTP,
  loginWithOTP,
  resetPassword
};
