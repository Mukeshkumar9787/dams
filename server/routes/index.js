import express from "express";
import authRoutes from "./auth.js";
import categoryRoutes from "./categories.js";
import fileRoutes from "./files.js"
import hsnRoutes from "./hsn.js"
import productRoutes from "./products.js"
import sizeRoutes from "./size.js"
import colorRoutes from "./color.js"
import userRoutes from "./users.js"
import orderRoutes from "./orders.js"
import { getAuthMiddleware } from "../middlewares/authMiddleware.js";
import { ROLE_TYPES } from "../utils/constants.js";


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

router.use("/products", productRoutes);

router.use("/categories", categoryRoutes);

router.use("/sizes", sizeRoutes);

router.use("/colors", colorRoutes);

router.use("/users",getAuthMiddleware(), userRoutes);

router.use("/orders", orderRoutes);

router.use(getAuthMiddleware([ROLE_TYPES.ADMIN]));

router.use("/files", fileRoutes);

router.use("/hsn", hsnRoutes);

export default router;
