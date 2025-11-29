import express from "express";
import authRoutes from "./auth.js"; // always include .js in ESM

const router = express.Router();

// Register routes
router.use("/auth", authRoutes);

export default router;
