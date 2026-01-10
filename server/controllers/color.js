import { colorService } from "../services/index.js";
import { errorHandler } from "../utils/errorHandler.js";

const create = async (req, res) => {
  try {
    const result = await colorService.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Color created successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getAll = async (req, res) => {
  try {
    const result = await colorService.getAll(req.query);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getBySlug = async (req, res) => {
  try {
    const result = await colorService.getBySlug(req.params.slug);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const update = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await colorService.update(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Color updated successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await colorService.deleteById(id);

    return res.status(200).json({
      success: true,
      message: "Color deleted successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default {
  create,
  getAll,
  getBySlug,
  update,
  deleteById
};
