import express, { Express, json, urlencoded } from "express";
import { Connection } from "mongoose";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { Server } from "http";
import DB from "@src/db";
import routes from "@src/routes";
import { dbConfig, serverConfig } from "@src/configs/";
import systemMiddleware from "@src/middlewares/system.middleware";
import logger from "./utils/logger";
import { setupSwagger } from "./configs/swagger";

class App {
  protected server!: Server;
  protected dbConnection!: Connection;
  protected corsOptions: cors.CorsOptions;

  constructor(public app: Express) {
    this.corsOptions = {
      origin: serverConfig.ALLOWED_ORIGINS
        ? serverConfig.ALLOWED_ORIGINS.split(",")
        : "*",
    };

    logger.info("⏳ Initializing database...");
    this.initializeDb();
    logger.info("✅ Database initialized!");

    logger.info("⏳ Setting up middlewares...");
    this.initializeMiddlewaresAndRoutes();
    logger.info("✅ Middleware set up!");

    this.setupProcessSignals();
  }

  private async initializeDb(): Promise<void> {
    try {
      this.dbConnection = await DB.connectDB(dbConfig.DB_URI);
      logger.debug("✅ MongoDB connection established");
    } catch (error) {
      logger.error(`❌ Error connecting to MongoDB: ${error}`);
      // ❌ Removed process.exit(1) to prevent restart loops
    }
  }

  private initializeMiddlewaresAndRoutes(): void {
    this.app.set("trust proxy", 1);
    this.app.use(compression());

    if (serverConfig.NODE_ENV === "development") {
      this.app.use(cors());
    } else {
      this.app.use(cors(this.corsOptions));
    }

    this.app.use(json());
    this.app.use(urlencoded({ extended: false }));
    this.app.use(helmet());

    if (["development", "staging"].includes(serverConfig.NODE_ENV)) {
      this.app.use(morgan("dev"));
    }

    this.setupPublicFiles();
    this.setupRoutes();

    this.setupErrorHandlingMiddleware();
  }

  private setupPublicFiles(): void {
    const publicPath = path.join(__dirname, "resources/public");
    this.app.use(express.static(publicPath));
  }

  private setupRoutes(): void {
    this.app.use(routes);
    setupSwagger(this.app);
  }

  private setupErrorHandlingMiddleware(): void {
    this.app.use(systemMiddleware.errorHandler());
  }

  private setupProcessSignals(): void {
    const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

    signals.forEach((signal) => {
      process.on(signal, async () => {
        logger.warn(`⚠️ Received ${signal}. Closing app...`);
        await this.close();
      });
    });
  }

  private async close(): Promise<void> {
    try {
      if (this.server) {
        await new Promise<void>((resolve) => {
          this.server.close(() => {
            logger.debug("✅ HTTP server closed, port released.");
            resolve();
          });
        });
      } else {
        logger.warn("⚠ No active HTTP server found.");
      }

      await DB.closeConnection();
      logger.debug("✅ Shutdown completed successfully\n");

      process.exit(0); // ✅ EXIT ONLY if everything is properly closed
    } catch (error) {
      logger.error(`❌ Error during shutdown: ${error}`);
    }
  }

  public start(): Server {
    if (this.server) {
      logger.warn("⚠ Server is already running. Ignoring duplicate start.");
      return this.server;
    }

    logger.debug("⚡ Starting server...");
    this.server = this.app.listen(serverConfig.PORT || 3000, () => {
      logger.debug(
        `✅ Server running on port ${serverConfig.PORT || 3000} in ${
          serverConfig.NODE_ENV
        } mode.`
      );
    });

    return this.server;
  }
}

// ✅ Only call `start()` once
const app = new App(express());

const server = app.start();
export default server;
