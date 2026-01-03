import Joi from "joi";
import { STATUS_TYPES } from "./constants.js";

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