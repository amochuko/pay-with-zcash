import winston from "winston";
import { serverEnv } from "./server-env";

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const logger = winston.createLogger({
  level: serverEnv.LOG_LEVEL,
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.Console({
      format:
        serverEnv.NODE_ENV === "development"
          ? combine(colorize(), timestamp(), errors({ stack: true }), simple())
          : combine(errors({ stack: true }), timestamp(), json()),
    }),
  ],
});

export default logger;
