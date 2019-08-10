/*
 ** Description: Gets user persona questions to be answered by frontend
 */
const express = require("express");
const router = express.Router();

const UserPersona = require("../../models/userPersona");
const User = require("../../models/user");

const dbDebugger = require("debug")("app:db");
const logger = require("../../utils/loggerSetup");

// @route   POST /routes/users/postUserPersonaScore
// @desc    Updates the persona score and inserts OCEAN.
// @access  Private (should be private - learn to check via jwt)
router.post("/", async (req, res) => {
  dbDebugger("Reached /routes/users/postUserPersonaScore req.body:", req.body);
  dbDebugger(
    " list length:",
    req.body.personalList.length,
    " baandaid:",
    req.body.baandaid
  );
  let userPersonaDoc,
    retMsg = "";
  try {
    dbDebugger("Trying UserPersona.findOne ...");
    userPersonaDoc = await UserPersona.findOne({ baandaId: req.body.baandaid });
    dbDebugger("userPersonaDoc:", userPersonaDoc);
    let dl = userPersonaDoc.persona_qa_set.length;
    dbDebugger("dl: ", dl);
    if (dl === 0) {
      throw new Error( `No record in userpersonas for baandaid: ${req.body.baandaid}`);
    }

    for (var i = 0; i < dl; i++) {
      if (i < 2) {
        dbDebugger("i." + i, userPersonaDoc.persona_qa_set[i].score);
        // let zz = JSON.parse(req.body.personalList[i]);
        dbDebugger(
          "i. req body [0]:",
          req.body.personalList[i].score,
          " score:"
        );
      }

      userPersonaDoc.persona_qa_set[i].score = req.body.personalList[i].score;
    }

    // See if both can be done in a single transaction ....
    let justScore = await userPersonaDoc.save();
    retMsg = "Saved WIP";
    if (req.body.initDone) {
      let update = req.body.ocean;
      dbDebugger("update:", update, " baandaId:", req.body.baandaid);
      let user = await User.findOneAndUpdate(
        { baandaId: req.body.baandaid },
        {
          $set: {
            persona: {
              O: update.O,
              C: update.C,
              E: update.E,
              A: update.A,
              N: update.N
            },
            isInitDone: true
          }
        },
        { new: true }
      );
      retMsg = "Success";
      dbDebugger("user:", user);
      let logMsg = {
        type: "application",
        domain: "personaIntel",
        msg: `Done init of persona creation for baandaId: ${req.body.baandaid}`
      };
      logger.info(JSON.stringify(logMsg));
    }
  } catch (err) {
    dbDebugger("Err:", err);
    return res.status(400).json("Error:" + JSON.stringify(err));
  }

  res.status(200).json(retMsg);
});

module.exports = router;
