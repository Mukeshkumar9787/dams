import { categoryService } from "../services/index.js";
import { errorHandler } from "../utils/errorHandler.js";

const createCategory = async (req, res) => {
  try {
    const { title, status, fileIds } = req.body;

    const result = await categoryService.createCategory({ title, status, fileIds });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getCategories = async (req, res) => {
  try {
    const result = await categoryService.getCategories();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getCategoryBySlug = async (req, res) => {
  try {
    const result = await categoryService.getCategoryBySlug(req.params.slug);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, fileIds, deletedFileIds } = req.body;

    const result = await categoryService.updateCategory(id, { title, fileIds, deletedFileIds });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await categoryService.deleteCategory(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
};
