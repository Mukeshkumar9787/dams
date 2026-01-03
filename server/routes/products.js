import express from "express";
import productController from "../controllers/products.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { productBodySchema } from "../utils/validation.js";

const router = express.Router();

// Create product
router.post("/", validateInput(productBodySchema),productController.createProduct);

// Get all categories
router.get("/", productController.getProducts);

// Get single product by ID
router.get("/:slug", productController.getProductBySlug);

// Update product
router.put("/:id", validateInput(productBodySchema), productController.updateProduct);

// Delete product
router.delete("/:id", productController.deleteProduct);

export default router;
