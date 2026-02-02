import express from "express";
import categoryController from "../controllers/categories.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { categoryBodySchema } from "../utils/validation.js";
import { adminMiddleware, conditionAdminMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all categories
router.get("/", conditionAdminMiddleware, categoryController.getCategories);

router.use(adminMiddleware);

// Create category
router.post("/", validateInput(categoryBodySchema),categoryController.createCategory);

// Get single category by ID
router.get("/:slug", categoryController.getCategoryBySlug);

// Update category
router.put("/:id", validateInput(categoryBodySchema), categoryController.updateCategory);

// Delete category
router.delete("/:id", categoryController.deleteCategory);

export default router;
