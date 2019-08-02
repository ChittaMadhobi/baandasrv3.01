/*
 ** Description: Post user's profile (init and/or edited versions)
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
// const logger = require("../../utils/loggerSetup");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// DB Schemas
const User = require("../../models/user");

// @route   POST /routes/users/postUserPersonaScore
// @desc    Updates the persona score and inserts OCEAN.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  dbDebugger("req.body:", req.body);
  let geoInfo = JSON.stringify(req.body.profile.locationCurr);
  try {
    // let user = await User.findOne({ baandaId: req.body.baandaid });
    let user = await User.findOneAndUpdate(
      { baandaId: req.body.baandaid },
      {
        $set: {
          profileInfo: {
            cell: {
              number: req.body.profile.cell
            },
            preferredName: req.body.profile.preferredName,
            formalName: req.body.profile.formalName,
            selfDescription: req.body.profile.selfDecription,
            preferredPronoun: req.body.profile.preferredPronoun,
            geoCentricInfo: geoInfo
          },
          isInitProfileDone: true
        }
      },
      { new: true }
    );
    dbDebugger("user:", user);

    payload = {
      baandaId: user.baandaId,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      isInitDone: user.isInitDone,
      isInitProfileDone: user.isInitProfileDone
    };
    let token = await jwt.sign(payload, keys.secretOrKey);
    dbDebugger("token:", token);
    // , (err, token) => {
    res.status(200).json({ success: true, token: "Bearer " + token });
    //   });
    // res.status(200).json(user);
  } catch (err) {
    dbDebugger("profile post error:", err);
    res.status(400).json(err);
  }
});

module.exports = router;
