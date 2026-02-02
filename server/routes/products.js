import express from "express";
import productController from "../controllers/products.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { productBodySchema, productUpdateSchema } from "../utils/validation.js";
import { adminMiddleware, conditionAdminMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all categories
router.get("/", conditionAdminMiddleware, productController.getProducts);

router.use(adminMiddleware);

// Create product
router.post("/", validateInput(productBodySchema),productController.createProduct);

// Get single product by ID
router.get("/:slug", productController.getProductBySlug);

// Update product
router.put("/:id", validateInput(productUpdateSchema), productController.updateProduct);

// Delete product
router.delete("/:id", productController.deleteProduct);

export default router;
