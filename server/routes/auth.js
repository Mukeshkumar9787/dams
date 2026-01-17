import express from "express";
import authController from "../controllers/auth.js"; // use .js extension
import validateInput from "../middlewares/requestValidationMiddleware.js";
import { loginSchema, loginWithOTPSchema, registerSchema, resetPasswordSchema, verifyOTPSchema } from "../utils/validation.js";

const router = express.Router();

// Register user
router.post("/register", validateInput(registerSchema),  authController.register);


router.post("/reset-password", validateInput(resetPasswordSchema),  authController.resetPassword);

// Login user
router.post("/login", validateInput(loginSchema),authController.login);

// Login with OTP
router.post("/login-with-otp", validateInput(loginWithOTPSchema),  authController.loginWithOTP);

// Verify OTP
router.post("/verifyOTP", validateInput(verifyOTPSchema), authController.verifyOTP);

export default router;
