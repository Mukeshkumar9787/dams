import express from "express";
import sizeController from "../controllers/size.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { sizeBodySchema } from "../utils/validation.js";

const router = express.Router();

// Create size
router.post("/", validateInput(sizeBodySchema),sizeController.createSize);

// Get all categories
router.get("/", sizeController.getSizes);

// Get single size by ID
router.get("/:slug", sizeController.getSizeBySlug);

// Update size
router.put("/:id", validateInput(sizeBodySchema), sizeController.updateSize);

// Delete size
router.delete("/:id", sizeController.deleteSize);

export default router;
