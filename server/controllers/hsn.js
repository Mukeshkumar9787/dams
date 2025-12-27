import { hsnService } from "../services/index.js";
import { errorHandler } from "../utils/errorHandler.js";

const createHsn = async (req, res) => {
  try {
    const result = await hsnService.createHsn(req.body);

    return res.status(201).json({
      success: true,
      message: "Hsn created successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getHsnCodes = async (req, res) => {
  try {
    const result = await hsnService.getHsnCodes(req.query);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getHsnBySlug = async (req, res) => {
  try {
    const result = await hsnService.getHsnBySlug(req.params.slug);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const updateHsn = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await hsnService.updateHsn(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Hsn updated successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const deleteHsn = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await hsnService.deleteHsn(id);

    return res.status(200).json({
      success: true,
      message: "Hsn deleted successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default {
  createHsn,
  getHsnCodes,
  getHsnBySlug,
  updateHsn,
  deleteHsn,
};
