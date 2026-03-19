import express from "express";
import auditLogController from "../controllers/auditLogs.js";

const router = express.Router();

router.get("/stats", auditLogController.getStats);
router.get("/", auditLogController.getAll);

export default router;
