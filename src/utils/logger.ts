import winston from "winston";
import { serverConfig } from "@src/configs"; // Assuming you have a config file

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: serverConfig.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(), // Logs to console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Logs errors to file
    new winston.transports.File({ filename: "logs/combined.log" }), // Logs everything to a file
  ],
});

export default logger;
