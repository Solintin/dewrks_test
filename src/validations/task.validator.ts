import { BaseValidator } from "./index";
// import Joi, { ValidationResult } from 'joi';
import Joi, { ValidationResult } from "joi";
import { status } from "@src/interfaces/enum.interface";
import { Request } from "express";

class VolunteerValidatorUtils extends BaseValidator {
  public create = (req: Request): ValidationResult => {
    const schema = Joi.object({
      title: Joi.string().trim().min(3).max(100).required(),
      status: Joi.string().valid(...Object.values(status)),
      description: Joi.string().trim().max(500).allow("").optional(),
    });
    return this.validate(schema, req.body);
  };
  public update = (req: Request): ValidationResult => {
    const schema = Joi.object({
      title: Joi.string().trim().min(3).max(100).optional(),
      status: Joi.string()
        .valid(...Object.values(status))
        .optional(),

      description: Joi.string().trim().max(500).allow("").optional(),
    });
    return this.validate(schema, req.body);
  };
}

export default new VolunteerValidatorUtils();
