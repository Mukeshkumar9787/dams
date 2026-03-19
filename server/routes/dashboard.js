import express from "express";
import dashboardController from "../controllers/dashboard.js";

const router = express.Router();

router.get("/", dashboardController.getAdminDashboard);

export default router;
