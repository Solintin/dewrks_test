import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import Joi, { ValidationResult } from "joi";
import { serverConfig } from "@src/configs";
import mongoose, { FilterQuery } from "mongoose";
import { BadRequestError, ApplicationError, SystemError } from "@src/errors";
import { rateLimit } from "express-rate-limit";
import { IRequest, PageOptions } from "@src/interfaces/function.interface";

class SystemMiddlewares {
  public errorHandler(): ErrorRequestHandler {
    return (
      error: SystemError,
      _req: Request,
      res: Response,
      next: NextFunction
    ): void => {
      const isProduction = serverConfig.NODE_ENV === "production";
      const errorCode = error.code || 500;
      let errorMessage: SystemError | object = {};

      if (res.headersSent) {
        return next(error); // Ensure proper handling if headers are already sent
      }

      if (!isProduction) {
        errorMessage = error;
      }

      if (error instanceof Joi.ValidationError) {
        res.status(400).json({
          message: "Validation error.",
          error: error.details.map((detail) => detail.message),
        });
        return;
      }

      if (errorCode === 500 && isProduction) {
        res.status(500).json({
          message: "An unexpected error occurred. Please try again later.",
        });
        return;
      }

      res.status(errorCode).json({
        message: error.message,
        error: {
          ...(error.errors && { error: error.errors }),
          ...(!isProduction && { trace: errorMessage }),
        },
      });

      return; // Ensures the function returns `void`
    };
  }

  validateParamId = (param: string) => {
    return (req: Request, _res: Response, next: NextFunction) => {
      try {
        const { params } = req;

        // Ensure `paramIds` exists on the request object
        if (!(req as any).paramIds) {
          (req as any).paramIds = {};
        }

        // Validate the parameter
        if (!mongoose.Types.ObjectId.isValid(params[param])) {
          throw new BadRequestError(`Invalid ${param}`);
        }

        // Add the validated ID to `paramIds`
        (req as any).paramIds[param] = new mongoose.Types.ObjectId(
          params[param]
        );

        return next();
      } catch (err) {
        next(err);
      }
    };
  };
  public filterMiddleware = (
    req: IRequest,
    _: Response,
    next: NextFunction
  ) => {
    const filters: FilterQuery<any> = {};
    const pageOpt: Partial<PageOptions> = {};
    // Extract query parameters
    for (const key in req.query) {
      const value = req.query[key] as string;

      if (!value) continue;

      // Handle pagination parameters separately
      if (key === "limit")
        pageOpt.limit = Math.max(1, parseInt(value, 10) || 10);
      else if (key === "page")
        pageOpt.page = Math.max(1, parseInt(value, 10) || 1);
      else if (key === "sortBy") pageOpt.sort.field = value;
      else if (key === "sortOrder" && (value === "asc" || value === "desc"))
        pageOpt.sort.order = value;
      else {
        // Treat all other query parameters as filters (case-insensitive regex search)
        filters[key] = { $regex: new RegExp(value, "i") };
      }
    }

    // Attach to request
    req.filters = filters;
    req.pageOpt = pageOpt;

    next();
  };

  public validateRequestBody = (
    validator: (req: Request) => ValidationResult
  ) => {
    return (req: Request, _res: Response, next: NextFunction) => {
      const { error, value } = validator(req);
      if (error) next(error);
      req.body = value;

      next();
    };
  };
  public rateLimiter = () => {
    return rateLimit({
      windowMs: 1 * 60 * 1000,
      limit: serverConfig.MAX_REQUESTS_PER_MINUTE,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      message: () => {
        throw new ApplicationError(429, "You are hitting me too fast");
      },
      //   store: new RedisStore({
      // sendCommand: (...args) => redisClient.call(...args),
      //   }),
    });
  };
}
export default new SystemMiddlewares();
