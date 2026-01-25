import express from "express";
import categoryController from "../controllers/categories.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { categoryBodySchema } from "../utils/validation.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all categories
router.get("/", categoryController.getCategories);

router.use(authMiddleware);

// Create category
router.post("/", validateInput(categoryBodySchema),categoryController.createCategory);

// Get single category by ID
router.get("/:slug", categoryController.getCategoryBySlug);

// Update category
router.put("/:id", validateInput(categoryBodySchema), categoryController.updateCategory);

// Delete category
router.delete("/:id", categoryController.deleteCategory);

export default router;
