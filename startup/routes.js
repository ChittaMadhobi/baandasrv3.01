/*
 ** Description: This module is responsible as a traffice controller of api routing
 ** Rivision Log:
 ** Author               Date        Description
 ** -----------------    ----------- -------------------------------------------------
 ** Jit (Sarbojit)       Jul 11, 19  Program initiated.
 **
 */
// const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
// const path = require("path");
const startupDebugger = require('debug')('app:startup');
// Somewhere ... for db or other stuff we can write - port it to db modules
// const dbDebugger = require('debug')('app:db');
// To debug, go to terminal and set c:/..> set DEBUG=app:startup<,app:db> or =app:* for all for all startup related console.log
const express = require("express");

const entryLogger = require("../middleware/logger");

const register = require("../routes/users/register");
const login = require("../routes/users/login");
const verify = require("../routes/users/verify");

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  // helmet is a security blanket that stops providing server http info
  // to the browser. Commented in dev time. Uncomment before porting to prduction.
  // app.use(helmet());

  // Change logfile name with date every day later on.
  // May want to use Morgan only when we want to study delays etc. 
  // For performance, use it only in development for R&D
  if (app.get("env") === "development") {
    app.use(
      morgan("common", {
        stream: fs.createWriteStream("./log/" + "access.log", { flags: "a" })
      })
    );
    startupDebugger('Morgan enabled');
  }

  // Log any invocation to api upon entry into Baanda server that includes BaandaId.
  app.use(entryLogger);

  app.use("/routes/users/register", register);
  app.use("/routes/users/login", login);
  app.use("/routes/users/verify", verify);
};
