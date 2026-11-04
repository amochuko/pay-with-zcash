import winston from "winston";
import { serverEnv } from "./server-env";

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const isDevelopment = serverEnv.NODE_ENV === "development";

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: isDevelopment
      ? combine(colorize(), timestamp(), errors({ stack: true }), simple())
      : combine(errors({ stack: true }), timestamp(), json()),
  }),
];

// File logging is restricted to local development
if (isDevelopment) {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  );
}
const logger = winston.createLogger({
  level: serverEnv.LOG_LEVEL,
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports,
});

export default logger;
