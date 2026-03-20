import multer from "multer";
import path from "path";
import fs from "fs";
import { isR2Configured } from "../utils/r2.js";

// ensure upload directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.fieldname;
    const unique = Date.now();

    cb(null, `${name}-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

const multerFileUploadMiddleware = multer({
  storage: isR2Configured() ? multer.memoryStorage() : diskStorage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export default multerFileUploadMiddleware;
