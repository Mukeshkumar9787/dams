import express from "express";
import orderController from "../controllers/orders.js"; 
import validateInput from "../middlewares/requestValidationMiddleware.js";
import { createOrderSchema } from "../utils/validation.js";

const router = express.Router();

router.post("/", validateInput(createOrderSchema), orderController.createOrder);

export default router;
