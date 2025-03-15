import VolunteerController from "@src/controllers/task.controller";
import { Router } from "express";
import volunteerValidator from "@src/validations/task.validator";
import systemMiddleware from "@src/middlewares/system.middleware";

class VolunteerRoutes extends VolunteerController {
  public router: Router;

  constructor() {
    super();
    this.router = Router({ mergeParams: true });
    this.routes();
  }

  public routes() {
    this.router.get("/", this.index.bind(this));

    this.router.post(
      "/",
      systemMiddleware.validateRequestBody(volunteerValidator.create),
      this.create.bind(this)
    );
    this.router.patch(
      "/:volunteerId",
      systemMiddleware.validateParamId("volunteerId"),
      systemMiddleware.validateRequestBody(volunteerValidator.update),
      this.update.bind(this)
    );
    this.router.delete(
      "/:volunteerId",
      systemMiddleware.validateParamId("volunteerId"),
      this.delete.bind(this)
    );
    this.router.get(
      "/:volunteerId",
      systemMiddleware.validateParamId("volunteerId"),
      this.get.bind(this)
    );
  }
}

export default new VolunteerRoutes().router;
