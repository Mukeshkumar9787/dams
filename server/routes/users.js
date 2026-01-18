import express from "express";
import userController from "../controllers/users.js"; 


const router = express.Router();

// Register user
router.get("/getUserInfo", userController.getUserInfo);

router.patch("/updateProfile", userController.updateProfile);

export default router;
