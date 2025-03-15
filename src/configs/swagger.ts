import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import serverConfig from "./server.config";

// ✅ Swagger Options
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FoodClique API",
      version: "1.0.0",
      description: "API documentation for the FoodClique Management System",
    },
    servers: [
      {
        url: ` http://localhost:${serverConfig.PORT}`,
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./rc/controllers/*.ts"], // Define the paths where API docs are written
};

// ✅ Generate Swagger Docs
const swaggerSpec = swaggerJsdoc(options);

// ✅ Function to setup Swagger
export const setupSwagger = (app: Express) => {
  // console.log(app);

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // app.get("/docs.json", (_, res) => {
  //   res.setHeader("Content-Type", "application/json");
  //   res.send(swaggerSpec);
  // });
  console.log(
    `📄 Swagger Docs available at: http://localhost:${serverConfig.PORT}/api`
  );
};
