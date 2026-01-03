import { productService } from "../services/index.js";
import { errorHandler } from "../utils/errorHandler.js";

const createProduct = async (req, res) => {
  try {

    const result = await productService.createProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "product created successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getProducts = async (req, res) => {
  try {
    const { products, totalCount} = await productService.getProducts(req.query);
    return res.status(200).json({
      success: true,
      data: products,
      totalCount
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const result = await productService.getProductBySlug(req.params.slug);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await productService.updateProduct(id, req.body);

    return res.status(200).json({
      success: true,
      message: "product updated successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await productService.deleteProduct(id);

    return res.status(200).json({
      success: true,
      message: "product deleted successfully",
      data: result,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
