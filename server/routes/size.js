import express from "express";
import sizeController from "../controllers/size.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { sizeBodySchema, statusValidationForCommonUser } from "../utils/validation.js";
import { ROLE_TYPES } from "../utils/constants.js";
import { getAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all categories
router.get("/active", sizeController.getActiveSizes);

router.use(getAuthMiddleware([ROLE_TYPES.ADMIN]));

router.get("/", sizeController.getSizes);

// Create size
router.post("/", validateInput(sizeBodySchema),sizeController.createSize);

// Get single size by ID
router.get("/:slug", sizeController.getSizeBySlug);

// Update size
router.put("/:id", validateInput(sizeBodySchema), sizeController.updateSize);

// Delete size
router.delete("/:id", sizeController.deleteSize);

export default router;
