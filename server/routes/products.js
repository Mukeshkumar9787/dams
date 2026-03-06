import express from "express";
import productController from "../controllers/products.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { productBodySchema, productUpdateSchema } from "../utils/validation.js";
import { getAuthMiddleware } from "../middlewares/authMiddleware.js";
import { ROLE_TYPES } from "../utils/constants.js";

const router = express.Router();

// Get all categories
router.get("/active", productController.getActiveProducts);

// Get single product by ID
router.get("/:slug", productController.getProductBySlug);

router.post("/:id/notify-me", getAuthMiddleware(), productController.subscribeProductRestockNotification);

router.use(getAuthMiddleware([ROLE_TYPES.ADMIN]));

router.get("/", productController.getProducts);

// Create product
router.post("/", validateInput(productBodySchema),productController.createProduct);

// Update product
router.put("/:id", validateInput(productUpdateSchema), productController.updateProduct);

// Delete product
router.delete("/:id", productController.deleteProduct);

export default router;
