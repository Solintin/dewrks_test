import AuthController from "@src/controllers/auth.controller";
import { Router } from "express";
import AuthValidator from "@src/validations/auth.validator";
import systemMiddleware from "@src/middlewares/system.middleware";

class AuthRoutes extends AuthController {
  public router: Router;

  constructor() {
    super();
    this.router = Router({ mergeParams: true });
    this.routes();
  }

  public routes() {
    this.router.post(
      "/register",
      systemMiddleware.validateRequestBody(AuthValidator.create),
      this.signUp.bind(this)
    );
    this.router.post(
      "/login",
      systemMiddleware.validateRequestBody(AuthValidator.login),
      this.login.bind(this)
    );
  }
}

export default new AuthRoutes().router;
