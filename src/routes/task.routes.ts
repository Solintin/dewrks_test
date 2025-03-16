import TaskController from "@src/controllers/task.controller";
import { Router } from "express";
import TaskValidator from "@src/validations/task.validator";
import systemMiddleware from "@src/middlewares/system.middleware";
import AuthenticationMiddleware from "@src/middlewares/auth.middleware";

class TaskRoutes extends TaskController {
  public router: Router;

  constructor() {
    super();
    this.router = Router({ mergeParams: true });
    this.routes();
  }

  public routes() {
    this.router.get(
      "/",
      AuthenticationMiddleware.validateUserAccess,
      this.index.bind(this)
    );
    this.router.get(
      "/overview",
      AuthenticationMiddleware.validateUserAccess,
      this.overview.bind(this)
    );

    this.router.post(
      "/",
      systemMiddleware.validateRequestBody(TaskValidator.create),
      AuthenticationMiddleware.validateUserAccess,
      this.create.bind(this)
    );
    this.router.patch(
      "/:taskId",
      systemMiddleware.validateParamId("taskId"),
      systemMiddleware.validateRequestBody(TaskValidator.update),
      this.update.bind(this)
    );
    this.router.delete(
      "/:taskId",
      AuthenticationMiddleware.validateUserAccess,
      systemMiddleware.validateParamId("taskId"),
      this.delete.bind(this)
    );
    this.router.get(
      "/:taskId",
      AuthenticationMiddleware.validateUserAccess,
      systemMiddleware.validateParamId("taskId"),
      this.get.bind(this)
    );
  }
}

export default new TaskRoutes().router;
