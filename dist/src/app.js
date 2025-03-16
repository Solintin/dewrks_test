"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./db"));
const routes_1 = __importDefault(require("./routes"));
const configs_1 = require("./configs");
const system_middleware_1 = __importDefault(require("./middlewares/system.middleware"));
const logger_1 = __importDefault(require("./utils/logger"));
const swagger_1 = require("./configs/swagger");
class App {
    constructor(app) {
        this.app = app;
        this.corsOptions = {
            origin: configs_1.serverConfig.ALLOWED_ORIGINS
                ? configs_1.serverConfig.ALLOWED_ORIGINS.split(",")
                : "*",
        };
        logger_1.default.info("⏳ Initializing database...");
        this.initializeDb();
        logger_1.default.info("✅ Database initialized!");
        logger_1.default.info("⏳ Setting up middlewares...");
        this.initializeMiddlewaresAndRoutes();
        logger_1.default.info("✅ Middlewares set up!");
        this.setupProcessSignals();
    }
    initializeDb() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.dbConnection = yield db_1.default.connectDB(configs_1.dbConfig.DB_URI);
                logger_1.default.debug("✅ MongoDB connection established");
            }
            catch (error) {
                logger_1.default.error(`❌ Error connecting to MongoDB: ${error}`);
            }
        });
    }
    initializeMiddlewaresAndRoutes() {
        this.app.set("trust proxy", 1);
        this.app.use((0, compression_1.default)());
        if (configs_1.serverConfig.NODE_ENV === "development") {
            this.app.use((0, cors_1.default)());
        }
        else {
            this.app.use((0, cors_1.default)(this.corsOptions));
        }
        this.app.use((0, express_1.json)());
        this.app.use((0, express_1.urlencoded)({ extended: false }));
        this.app.use((0, helmet_1.default)());
        if (["development", "staging"].includes(configs_1.serverConfig.NODE_ENV)) {
            this.app.use((0, morgan_1.default)("dev"));
        }
        this.setupPublicFiles();
        this.setupRoutes();
        this.setupErrorHandlingMiddleware();
    }
    setupPublicFiles() {
        const publicPath = path_1.default.join(__dirname, "resources/public");
        this.app.use(express_1.default.static(publicPath));
    }
    setupRoutes() {
        this.app.use(routes_1.default);
        (0, swagger_1.setupSwagger)(this.app);
    }
    setupErrorHandlingMiddleware() {
        this.app.use(system_middleware_1.default.errorHandler());
    }
    setupProcessSignals() {
        const signals = ["SIGINT", "SIGTERM"];
        signals.forEach((signal) => {
            process.on(signal, () => __awaiter(this, void 0, void 0, function* () {
                logger_1.default.warn(`⚠️ Received ${signal}. Closing app...`);
                yield this.close();
            }));
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.server) {
                    yield new Promise((resolve) => {
                        this.server.close(() => {
                            logger_1.default.debug("✅ HTTP server closed, port released.");
                            resolve();
                        });
                    });
                }
                else {
                    logger_1.default.warn("⚠ No active HTTP server found.");
                }
                yield db_1.default.closeConnection();
                logger_1.default.debug("✅ Shutdown completed successfully\n");
                process.exit(0);
            }
            catch (error) {
                logger_1.default.error(`❌ Error during shutdown: ${error}`);
            }
        });
    }
    start() {
        if (this.server) {
            logger_1.default.warn("⚠ Server is already running. Ignoring duplicate start.");
            return this.server;
        }
        logger_1.default.debug("⚡ Starting server...");
        this.server = this.app.listen(configs_1.serverConfig.PORT || 3000, () => {
            logger_1.default.debug(`✅ Server running on port ${configs_1.serverConfig.PORT || 3000} in ${configs_1.serverConfig.NODE_ENV} mode.`);
        });
        return this.server;
    }
}
const app = new App((0, express_1.default)());
const server = app.start();
exports.default = server;
