// const express = require("express");
const { format, transports, loggers } = require("winston");
require("winston-daily-rotate-file");
const fs = require("fs");

const env = process.env.NODE_ENV || "development";
const logDir = "log";
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%--results.log`,
  datePattern: "YYYY-MM-DD"
});

module.exports = loggers.add('my-logger', {
    level: env === "development" ? "verbose" : "info",
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
      }),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
      new transports.Console({
        level: "info",
        format: format.combine(
          format.colorize(),
          format.printf(
            info => `${info.timestamp} ${info.level}: ${info.message}`
          )
        )
      }),
      dailyRotateFileTransport
    ]
  });