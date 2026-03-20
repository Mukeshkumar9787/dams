import { fileService } from "../services/index.js";
import { errorHandler } from "../utils/errorHandler.js";

const getUploadConfig = async (req, res) => {
  try {
    const result = await fileService.getUploadConfig(req.body);

    return res.status(200).json({
      success: true,
      message: "Upload config fetched successfully",
      data: result
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const createFile = async (req, res) => {
  try {
    const result = await fileService.createFile({ file: req.file });

    return res.status(201).json({
      success: true,
      message: "File created successfully",
      data: result
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const completeDirectUpload = async (req, res) => {
  try {
    const result = await fileService.createFileFromPath(req.body);

    return res.status(201).json({
      success: true,
      message: "File created successfully",
      data: result
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default {
  getUploadConfig,
  createFile,
  completeDirectUpload
};
