import Joi from "joi";
import { OTP_TYPES, STATUS_TYPES } from "./constants.js";

export const categoryBodySchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  fileIds: Joi.array()
    .items(Joi.number().integer().positive())
    .optional(),
  deletedFileIds: Joi.array()
    .items(Joi.number().integer().positive())
    .optional(),
  status: Joi.string()
    .valid(...Object.values(STATUS_TYPES))
    .default(STATUS_TYPES.ACTIVE),
});

export const hsnBodySchema = Joi.object({
  code: Joi.string().min(1).max(100).required(),
  tax: Joi.number().min(1).max(100).required(),
  status: Joi.string()
    .valid(...Object.values(STATUS_TYPES))
    .default(STATUS_TYPES.ACTIVE),
});

export const productBodySchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  categoryId: Joi.number().required(), 
  hsnId: Joi.number().optional(), 
  colorId: Joi.number().optional(), 
  sizeId: Joi.number().optional(), 
  mrp: Joi.number().required(), 
  price: Joi.number().required(), 
  stock: Joi.number().required(), 
  fileIds: Joi.array()
    .items(Joi.number().integer().positive())
    .optional(),
  deletedFileIds: Joi.array()
    .items(Joi.number().integer().positive())
    .optional(),
  status: Joi.string()
    .valid(...Object.values(STATUS_TYPES))
    .default(STATUS_TYPES.ACTIVE),
});

export const sizeBodySchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  status: Joi.string()
    .valid(...Object.values(STATUS_TYPES))
    .default(STATUS_TYPES.ACTIVE),
});

export const colorBodySchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  code: Joi.string().min(1).max(100).required(),
  status: Joi.string()
    .valid(...Object.values(STATUS_TYPES))
    .default(STATUS_TYPES.ACTIVE),
});

export const loginSchema = Joi.object({
  email: Joi.string().min(1).max(100).required(),
  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
    .required(),
  status: Joi.string()
    .valid(...Object.values(STATUS_TYPES))
    .default(STATUS_TYPES.ACTIVE),
});

export const registerSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().min(1).max(100).required(),
  mobile: Joi.string().min(1).max(12).required(),
  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
    .required()
});

export const verifyOTPSchema = Joi.object({
  email: Joi.string().min(1).max(100).required(),
  type: Joi.string()
    .valid(...Object.values(OTP_TYPES)),
  otp: Joi.string().min(6).required(),
});

export const loginWithOTPSchema = Joi.object({
  email: Joi.string().min(1).max(100).required(),
});