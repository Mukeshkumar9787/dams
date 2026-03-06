import { errorHandler } from "../utils/errorHandler.js";
import addressService from "../services/address.js";

const create = async (req, res) => {
  try {
    const data = await addressService.create(req.user.id, req.body);
    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      data,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getByUserId = async (req, res) => {
  try {
    const data = await addressService.getByUserId(req.user.id);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const remove = async (req, res) => {
  try {
    const addressId = Number(req.params.id);
    if (!Number.isInteger(addressId) || addressId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid address id",
      });
    }
    await addressService.remove(req.user.id, addressId);
    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const update = async (req, res) => {
  try {
    const addressId = Number(req.params.id);
    if (!Number.isInteger(addressId) || addressId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid address id",
      });
    }
    const data = await addressService.update(req.user.id, addressId, req.body);
    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default {
  create,
  getByUserId,
  remove,
  update,
};
