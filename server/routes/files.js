import express from "express";
import fileController from "../controllers/files.js";
import multerFileUploadMiddleware from "../middlewares/fileUploadMiddleware.js"

const router = express.Router();

router.post("/upload-config", fileController.getUploadConfig);
router.post("/", multerFileUploadMiddleware.single('file') , fileController.createFile);
router.post("/complete", fileController.completeDirectUpload);

export default router;
