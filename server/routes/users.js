import express from "express";
import userController from "../controllers/users.js"; 
import { getAuthMiddleware } from "../middlewares/authMiddleware.js";
import { ROLE_TYPES } from "../utils/constants.js";
import validateInput from "../middlewares/requestValidationMiddleware.js";
import { changeRoleSchema, updateProfileSchema } from "../utils/validation.js";


const router = express.Router();

// Register user
router.get("/getUserInfo", userController.getUserInfo);

router.patch("/updateProfile", validateInput(updateProfileSchema), userController.updateProfile);

router.get("/", getAuthMiddleware([ROLE_TYPES.ADMIN]), userController.getAll);

router.patch("/role", getAuthMiddleware([ROLE_TYPES.ADMIN]), validateInput(changeRoleSchema),  userController.changeRole);

export default router;
