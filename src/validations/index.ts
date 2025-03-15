import joi, { ValidationOptions } from "joi";
import mongoose, { isValidObjectId } from "mongoose";

export class BaseValidator {
  public validationOption: ValidationOptions = {
    errors: {
      wrap: {
        label: "",
      },
    },
    abortEarly: false,
  };

  public patterns = {
    phoneNumber: /^(?:\+234|0)(?:70|80|81|90|91)\d{8}$/,
    // '24HTime': /^([01]\d|2[0-3]):([0-5]\d)$/,
    // dateTime: /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/,
  };

  public validate = (schema: joi.AnySchema, payload: unknown) => {
    return schema.validate(payload, this.validationOption);
  };
}

export const Joi = joi.extend((joi) => ({
  type: "objectId",
  base: joi.string(),
  messages: {
    "objectId.invalid": "{{#label}} must be a valid {{#label}} Id",
  },
  validate(value, helpers) {
    if (!isValidObjectId(value)) {
      return {
        value: new mongoose.Types.ObjectId(value),
        errors: helpers.error("objectId.invalid"),
      };
    }
  },
}));
