import Joi from "joi";
import { STATUS_TYPES } from "./constants.js";

export const categoryBodySchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
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
