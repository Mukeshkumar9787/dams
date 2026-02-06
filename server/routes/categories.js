import express from "express";
import categoryController from "../controllers/categories.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { categoryBodySchema, statusValidationForCommonUser } from "../utils/validation.js";
import { getAuthMiddleware } from "../middlewares/authMiddleware.js";
import { ROLE_TYPES } from "../utils/constants.js";

const router = express.Router();

// Get all categories
router.get("/",getAuthMiddleware([ROLE_TYPES.ADMIN], statusValidationForCommonUser), categoryController.getCategories);

router.use(getAuthMiddleware([ROLE_TYPES.ADMIN]));

// Create category
router.post("/", validateInput(categoryBodySchema),categoryController.createCategory);

// Get single category by ID
router.get("/:slug", categoryController.getCategoryBySlug);

// Update category
router.put("/:id", validateInput(categoryBodySchema), categoryController.updateCategory);

// Delete category
router.delete("/:id", categoryController.deleteCategory);

export default router;
