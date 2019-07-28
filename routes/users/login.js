const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs"); // For encrypting password
const dbDebugger = require("debug")("app:db");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const _ = require("lodash");
const logger = require('../../utils/loggerSetup');
// DB Schemas
const User = require("../../models/user");
const UserPersona = require("../../models/userPersona");

const validateLoginInput = require("../../validation/users/validateLoginInput");
const initPersona = require("../../utilsdb/initUserPersona");

// @route   POST api/users/login
// @desc    Login user & return JWT Token
// @access  Public
router.post("/", async (req, res) => {
  dbDebugger(req.body);
  let payload = {};
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    dbDebugger("loging.js req.body isValid not valid");
    return res.status(400).json("Error:" + JSON.stringify(errors));
  }

  const email = req.body.email;
  const password = req.body.password;
  dbDebugger("email:" + email + "  password:" + password);
  try {
    let user = await User.findOne({ email: email });
    dbDebugger("Post findone user:", user);
    if (!user) {
      dbDebugger("login.js the user is not found...");
      errors.emailConfirm = "Invalid userId or password. Have you signed up?";
      return res.status(400).json(errors);
    }
    if (!user.isConfirmed) {
      dbDebugger("login.js the user not confirmed...");
      errors.emailConfirm = "Please confirm your email to login.";
      return res.status(400).json(errors);
    }

    let compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      dbDebugger("password did not matched ", compare);
      errors.emailConfirm = "Invalid userId or password.";
      return res.status(400).json(errors);
    }

    payload = {
      baandaId: user.baandaId,
      name: user.name,
      baandaid: user.baandaid,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      isInitDone: user.isInitDone
    };

    // If the userpersonas collection do not contain this user's document, please insert one.
    let initper = await UserPersona.find({ baandaId: user.baandaId });
    if (initper.length === 0) {
      dbDebugger("initper will be called with :" + user.baandaId);
      initPersona(user.baandaId);
    }

    dbDebugger("payload:", payload);
    let loggedinat = new Date();
    logMsg = {
      type: "Application",
      domain: "Auth",
      msg: `User ${user.baandaId} logged in at ${loggedinat}`
    };
    logger.info(JSON.stringify(logMsg));
    jwt.sign(payload, keys.secretOrKey, (err, token) => {
      res.json({
        success: true,
        token: "Bearer " + token
      });
    });
  } catch (err) {
    dbDebugger("Error:", err);
  }
});

module.exports = router;
