import { serverConfig } from "@src/configs";
import { NotFoundError } from "@src/errors";
import systemMiddleware from "@src/middlewares/system.middleware";
import { Request, Response, Router } from "express";
import os from "os";
import authRoutes from "./auth.routes";
import taskRoutes from "./task.routes";

class Routes {
  public router: Router;
  public apiVersion: string;

  constructor() {
    this.router = Router();
    this.apiVersion = "/api/v1";
    this.route();
  }

  private route(): void {
    this.router.use(systemMiddleware.rateLimiter());
    this.router.use(systemMiddleware.filterMiddleware);

    this.router.get("/", this.index);
    this.router.use(`${this.apiVersion}/auth`, authRoutes);
    this.router.use(`${this.apiVersion}/task`, taskRoutes);

    this.router.use("*", (req) => {
      throw new NotFoundError(
        `You missed the road Cannot ${req.method} ${req.originalUrl} on this server`
      );
    });
  }

  private index(_req: Request, res: Response): any {
    return res.status(200).json({
      message: `Welcome to Task Management API.`,
      data: {
        port: serverConfig.PORT,
        container_hostname: os.hostname(),
        processId: process.pid,
        environment: serverConfig.NODE_ENV,
        version: serverConfig.APP_VERSION,
      },
    });
  }
}

export default new Routes().router;
