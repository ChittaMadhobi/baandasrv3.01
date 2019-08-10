/*
** This verifies email after registration. Unless email is verified, a user cannot login.
*/
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
const keys = require("../../config/keys");
const User = require("../../models/user");
const BaandaID = require("../../models/baandaID");
const logger = require('../../utils/loggerSetup');

let logMsg;
// @route   POST api/users/register
// @desc    Login user & return JWT Token
// @access  Public
router.get("/", async (req, res) => {
  console.log(req.query);

  // Stuff to do
  // 1. define a const target URL (from config) to redirect to
  const clientHost = keys.clientHost;
  dbDebugger("clientHost: " + clientHost);

  try {
    // 2. Get user info. (if not found, someone is trying to hack)
    let email = req.query.email;
    let confirmCode = req.query.confirmCode;
    dbDebugger("req.query.email:" + email + "  confirmCode:" + confirmCode);
    let user = await User.findOne({ email: email });
    dbDebugger("Retrieved db user:" + JSON.stringify(user));

    // 3. check if user is confirmed.
    // 4. If confirmed ... 'redirect to login page and say, you are already confirmed.'
    if (user.isConfirmed && user.isActive) {
      res.redirect(clientHost);
    }

    // 6. findOneAndUpdate users with the baandaId, isConfirmed = true, isActive=true
    let baandaId = await BaandaID.findOneAndUpdate({
        ref: "baanda-id-ref  ",
        $inc: {
          newBaandaID: 1
        }
    });

    dbDebugger('baandaId:' + baandaId.newBaandaID + '  email:' + email);
    await User.findOneAndUpdate(
      { email: email },
      {
        baandaId: baandaId.newBaandaID,
        isConfirmed: true,
        isActive: true,
        updated_at: Date.now()
      }
    );
    // 7. Redirect to login page to the URL of #1 step.
    dbDebugger('clienthost:', clientHost);
    res.redirect(clientHost+'/?message=Please verify your email.');  // This is to React js Baanda app login page.
    
  } catch (err) {
    dbDebugger('Email verificaion error:', err);
    logMsg = { type: "server", domain: "startup", msg: 'email:' + req.query.email + '& confirmCode:' +  req.query.confirmCode + ' failed to verify with err:' + err.message};
    logger.error(JSON.stringify(logMsg));
    res.status(500).send('Error:'+err);
  }
  res.status(200).json('From verify');
});

module.exports = router;
