"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const server_config_1 = __importDefault(require("./server.config"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "FoodClique API",
            version: "1.0.0",
            description: "API documentation for the FoodClique Management System",
        },
        servers: [
            {
                url: ` http://localhost:${server_config_1.default.PORT}`,
                description: "Local server",
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./rc/controllers/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log(`📄 Swagger Docs available at: http://localhost:${server_config_1.default.PORT}/api`);
};
exports.setupSwagger = setupSwagger;
