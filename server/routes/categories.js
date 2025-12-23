import express from "express";
import categoryController from "../controllers/categories.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { categoryBodySchema } from "../utils/validation.js";

const router = express.Router();

// Create category
router.post("/", validateInput(categoryBodySchema),categoryController.createCategory);

// Get all categories
router.get("/", categoryController.getCategories);

// Get single category by ID
router.get("/:id", categoryController.getCategoryById);

// Update category
router.put("/:id", validateInput(categoryBodySchema), categoryController.updateCategory);

// Delete category
router.delete("/:id", categoryController.deleteCategory);

export default router;
