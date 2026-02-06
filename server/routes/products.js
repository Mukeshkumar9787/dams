import express from "express";
import productController from "../controllers/products.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { productBodySchema, productUpdateSchema, statusValidationForCommonUser } from "../utils/validation.js";
import { getAuthMiddleware } from "../middlewares/authMiddleware.js";
import { ROLE_TYPES } from "../utils/constants.js";

const router = express.Router();

// Get all categories
router.get("/", getAuthMiddleware([ROLE_TYPES.ADMIN], statusValidationForCommonUser), productController.getProducts);

router.use(getAuthMiddleware([ROLE_TYPES.ADMIN]));

// Create product
router.post("/", validateInput(productBodySchema),productController.createProduct);

// Get single product by ID
router.get("/:slug", productController.getProductBySlug);

// Update product
router.put("/:id", validateInput(productUpdateSchema), productController.updateProduct);

// Delete product
router.delete("/:id", productController.deleteProduct);

export default router;
