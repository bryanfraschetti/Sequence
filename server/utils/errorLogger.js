import winston from "winston";

export const errorLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    // new winston.transports.Console(), // Logs to the console
    new winston.transports.File({ filename: "/var/log/node/error.log" }), // Logs to a file
  ],
});
