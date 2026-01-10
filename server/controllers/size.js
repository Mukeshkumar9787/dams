import { sizeService } from "../services/index.js";
import { errorHandler } from "../utils/errorHandler.js";

const createSize = async (req, res) => {
  try {
    const result = await sizeService.createSize(req.body);

    return res.status(201).json({
      success: true,
      message: "Size created successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getSizes = async (req, res) => {
  try {
    const result = await sizeService.getSizes(req.query);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getSizeBySlug = async (req, res) => {
  try {
    const result = await sizeService.getSizeBySlug(req.params.slug);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const updateSize = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await sizeService.updateSize(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Size updated successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const deleteSize = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await sizeService.deleteSize(id);

    return res.status(200).json({
      success: true,
      message: "Size deleted successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default {
  createSize,
  getSizes,
  getSizeBySlug,
  updateSize,
  deleteSize,
};
