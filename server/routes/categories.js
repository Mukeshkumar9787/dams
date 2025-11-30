import express from "express";
import categoryController from "../controllers/categories.js"; // use .js extension

const router = express.Router();

// Create category
router.post("/create", categoryController.createCategory);

// Get all categories
router.get("/", categoryController.getCategories);

// Get single category by ID
router.get("/:id", categoryController.getCategoryById);

// Update category
router.put("/:id", categoryController.updateCategory);

// Delete category
router.delete("/:id", categoryController.deleteCategory);

export default router;
