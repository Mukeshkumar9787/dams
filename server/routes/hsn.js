import express from "express";
import hsnController from "../controllers/hsn.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { hsnBodySchema } from "../utils/validation.js";

const router = express.Router();

// Create hsn
router.post("/", validateInput(hsnBodySchema),hsnController.createHsn);

// Get all categories
router.get("/", hsnController.getHsnCodes);

// Get single hsn by ID
router.get("/:slug", hsnController.getHsnBySlug);

// Update hsn
router.put("/:id", validateInput(hsnBodySchema), hsnController.updateHsn);

// Delete hsn
router.delete("/:id", hsnController.deleteHsn);

export default router;
