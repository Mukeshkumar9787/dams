import express from "express";
import orderController from "../controllers/orders.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js";
import { createOrderSchema } from "../utils/validation.js";
import { getAuthMiddleware } from "../middlewares/authMiddleware.js";
import { ROLE_TYPES } from "../utils/constants.js";

const router = express.Router();

router.post("/",getAuthMiddleware(), validateInput(createOrderSchema), orderController.createOrder);

router.get("/",getAuthMiddleware(), orderController.getOrdersByUserId);

router.get("/admin", getAuthMiddleware([ROLE_TYPES.ADMIN]), orderController.getAdminOrders);

router.get("/:slug",getAuthMiddleware(), orderController.getOrderBySlugUser);

router.get("/:slug/admin", getAuthMiddleware([ROLE_TYPES.ADMIN]), orderController.getOrderBySlugAdmin);

export default router;
