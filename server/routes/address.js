import express from "express";
import addressController from "../controllers/address.js";
import validateInput from "../middlewares/requestValidationMiddleware.js";
import { addressBodySchema } from "../utils/validation.js";

const router = express.Router();

router.get("/", addressController.getByUserId);
router.post("/", validateInput(addressBodySchema), addressController.create);
router.patch("/:id", validateInput(addressBodySchema), addressController.update);
router.delete("/:id", addressController.remove);

export default router;
