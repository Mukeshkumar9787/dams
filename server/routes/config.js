import express from "express";
import validateInput from "../middlewares/requestValidationMiddleware.js"
import { configBodySchema } from "../utils/validation.js";
import configController from "../controllers/config.js"

const router = express.Router();

router.put("/", validateInput(configBodySchema), configController.createOrUpdate);

router.get("/", configController.getAll);

export default router;
