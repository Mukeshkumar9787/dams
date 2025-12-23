import { fileService } from "../services/index.js";
import { errorHandler } from "../utils/errorHandler.js";

const createFile = async (req, res) => {
  try {
    const result = await fileService.createFile({ path: req.file.path });

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
  createFile
};
