import express from "express";
import authRoutes from "./auth.js";
import categoryRoutes from "./categories.js";
import fileRoutes from "./files.js"
import hsnRoutes from "./hsn.js"
import productRoutes from "./products.js"
import sizeRoutes from "./size.js"
import colorRoutes from "./color.js"


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

router.use("/categories", categoryRoutes);

router.use("/files", fileRoutes);

router.use("/hsn", hsnRoutes);

router.use("/products", productRoutes);

router.use("/sizes", sizeRoutes);

router.use("/colors", colorRoutes);

export default router;
