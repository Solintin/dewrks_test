import { IRequest } from "@src/interfaces/function.interface";
import authService from "@src/services/auth.service";
import logger from "@src/utils/logger";
import { NextFunction, Response } from "express";

class AuthController {
  protected async signUp(
    req: IRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { body: signUpData } = req;
      console.log(signUpData);
      console.log(req);

      const user = await authService.signUp(signUpData);
      const data = await authService.login(user);
      return res.status(201).json({
        message: "Welcome Boss",
        data,
      });
    } catch (error) {
      logger.log("error", `Error in auth signup controller method: ${error}`);
      next(error);
    }
  }

  protected async login(
    req: IRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const {
        body: { email, password },
      } = req;
      const user = await authService.getUserForLogin(email, password);
      const data = await authService.login(user);
      return res.status(200).json({
        message: "Logged in successfully.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default AuthController;
