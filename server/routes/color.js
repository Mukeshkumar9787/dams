import express from "express";
import colorController from "../controllers/color.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { colorBodySchema, statusValidationForCommonUser } from "../utils/validation.js";
import { ROLE_TYPES } from "../utils/constants.js";
import { getAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all categories
router.get("/", getAuthMiddleware([ROLE_TYPES.ADMIN], statusValidationForCommonUser), colorController.getAll);

router.use(getAuthMiddleware([ROLE_TYPES.ADMIN]));

// Create size
router.post("/", validateInput(colorBodySchema),colorController.create);

// Get single size by ID
router.get("/:slug", colorController.getBySlug);

// Update size
router.put("/:id", validateInput(colorBodySchema), colorController.update);

// Delete size
router.delete("/:id", colorController.deleteById);

export default router;
