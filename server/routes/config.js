import express from "express";
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { configBodySchema } from "../utils/validation.js";
import configController from "../controllers/config.js"
import { getAuthMiddleware } from "../middlewares/authMiddleware.js";
import { ROLE_TYPES } from "../utils/constants.js";

const router = express.Router();

router.get("/", configController.getAll);

router.put("/", getAuthMiddleware([ROLE_TYPES.ADMIN]), validateInput(configBodySchema), configController.createOrUpdate);

export default router;
