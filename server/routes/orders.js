import express from "express";
import orderController from "../controllers/orders.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js";
import { createOrderSchema } from "../utils/validation.js";
import { getAuthMiddleware } from "../middlewares/authMiddleware.js";
import { ROLE_TYPES } from "../utils/constants.js";

const router = express.Router();

router.post("/", validateInput(createOrderSchema), orderController.createOrder);

router.get("/", orderController.getOrdersByUserId);

router.use(getAuthMiddleware([ROLE_TYPES.ADMIN]));

router.get("/admin", orderController.getAdminOrders);


export default router;
