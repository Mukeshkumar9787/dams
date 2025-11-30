import express from "express";
import authRoutes from "./auth.js";
import categoryRoutes from "./categories.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/categories", categoryRoutes);

export default router;
