import express from "express";
import authRoutes from "./auth.js";
import categoryRoutes from "./categories.js";
import fileRoutes from "./files.js"
import hsnRoutes from "./hsn.js"
import productRoutes from "./products.js"
import sizeRoutes from "./size.js"
import colorRoutes from "./color.js"
import userRoutes from "./users.js"
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static("uploads")
);

router.use("/auth", authRoutes);

router.use("/users", authMiddleware, userRoutes);

router.use("/products", productRoutes);

router.use("/categories", categoryRoutes);

router.use("/sizes", sizeRoutes);

router.use("/colors", colorRoutes);

router.use(adminMiddleware);

router.use("/files", fileRoutes);

router.use("/hsn", hsnRoutes);

export default router;
