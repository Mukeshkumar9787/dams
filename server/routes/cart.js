import express from "express";
import cartController from "../controllers/cart.js";
import validateInput from "../middlewares/requestValidationMiddleware.js";
import { replaceCartSchema } from "../utils/validation.js";
import { getAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(getAuthMiddleware());

router.get("/", cartController.getCart);
router.put("/", validateInput(replaceCartSchema), cartController.replaceCart);

export default router;
