import { BaseValidator } from "./index";
// import Joi, { ValidationResult } from 'joi';
import Joi, { ValidationResult } from "joi";
import { Request } from "express";

class AuthValidatorUtils extends BaseValidator {
  public create = (req: Request): ValidationResult => {
    const schema = Joi.object({
      name: Joi.string().trim().min(3).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().trim().min(5).max(100).required(),
    });
    return this.validate(schema, req.body);
  };
  public login = (req: Request): ValidationResult => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().trim().min(5).max(100).required(),
    });
    return this.validate(schema, req.body);
  };
}

export default new AuthValidatorUtils();
