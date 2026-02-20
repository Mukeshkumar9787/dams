import { configService } from "../services/index.js";
import { errorHandler } from "../utils/errorHandler.js";

const createOrUpdate = async (req, res) => {
  try {
    const result = await configService.createOrUpdate(req.body);

    return res.status(201).json({
      success: true,
      message: "Config created or updated successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getAll = async (req, res) => {
  try {
    const result = await configService.getAll();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};


export default {
  createOrUpdate,
  getAll
};
