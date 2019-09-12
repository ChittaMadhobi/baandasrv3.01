// const asyncMiddleware = require('../../middleware/async');
const express = require("express");
const router = express.Router();
// const winston = require('winston');

// const BaandaID = require("../../models/baandaID");
const BaandaID = require('../../models/allBaandaID');
const logger = require('../../utils/loggerSetup');

// function asyncMiddleware(handler) {
//   return async (req, res, next) => {
//     try {
//       // handler is always async and hence we need it here
//       await handler(req, res);
//     } catch (ex) {
//       next(ex);
//     }
//   };
// }

// express-async-errors replce async in rounter with asyncMiddleware hence code looks cleaner
// router.get("/", asyncMiddleware(async (req, res) => {
router.get("/", async (req, res) => {
  console.log("Inside dbtest:", req.query);
  // winston.info('This is from dbtest - testing logging -------------------------------');
  // try {
  //   let baandaID = await BaandaID.findOne({
  //     ref: "baanda-id-ref"
  //   });
  //   res.send(baandaID);
  // }
  // catch (ex) {
  //   console.log('something failed');
  //   // log the exception
  //   // res.status(500).send("Something failed");
  //   next(ex);
  // } finally {
  //   console.log('dbtest finally');
  // }
  try {
    let searchParam = "baanda-id-ref";
    let baandaID = await BaandaID.findOnex({
      ref: searchParam
    });
    console.log('baandaId:'+baandaID);
    if (baandaID !== null) {
      res.send(baandaID);
    } else {
      let error = { type: "Internal", domain: "DB", msg: "Null baandaId received for getting new baandaId with ref searchParm = " + searchParam, location : "routes/users/dbtest.js line:40"}
      throw error;
    }
  } catch (err) {
    console.log('Something went wrong - in catch err:');
    let logMsg;
    if (err.domain === "DB") {
      console.log('Inside err.domain : ' + JSON.stringify(err));
      logMsg = err;
      // winston.error(logMsg);
      logger.error(JSON.stringify(logMsg));
      res.status(500).send(JSON.stringify(logMsg));
    } else {
      console.log('Inside else of err.domain not DB: ' + err.message);
      logMsg = { type: "server", domain: "syntax", msg: err.message };
      // logMsg = { type: "server", domain: "startup", msg: `** Server BabiMaDidiMeGeno listening at port ${port}` };
      // winston.error(logMsg);
      logger.error(JSON.stringify(logMsg));
      return res.status(500).send(logMsg);
    }
  }

});

module.exports = router;
