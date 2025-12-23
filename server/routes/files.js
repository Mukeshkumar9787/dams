import express from "express";
import fileController from "../controllers/files.js";
import multerFileUploadMiddleware from "../middlewares/fileUploadMiddleware.js"

const router = express.Router();

router.post("/", multerFileUploadMiddleware.single('file') , fileController.createFile);

export default router;
