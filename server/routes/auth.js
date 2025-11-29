import express from "express";
import authController from "../controllers/auth.js"; // use .js extension

const router = express.Router();

// Register user
router.post("/register", authController.register);

// Login user
router.post("/login", authController.login);

export default router;
