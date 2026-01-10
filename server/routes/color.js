import express from "express";
import colorController from "../controllers/color.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { colorBodySchema } from "../utils/validation.js";

const router = express.Router();

// Create size
router.post("/", validateInput(colorBodySchema),colorController.create);

// Get all categories
router.get("/", colorController.getAll);

// Get single size by ID
router.get("/:slug", colorController.getBySlug);

// Update size
router.put("/:id", validateInput(colorBodySchema), colorController.update);

// Delete size
router.delete("/:id", colorController.deleteById);

export default router;
