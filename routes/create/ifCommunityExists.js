/*
 ** Description: Checks to see if a baandaid+commName exists
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");

// DB Schemas
const Community = require("../../models/community");

// @route   GET /routes/create/checkIfCommunityExists
// @desc    Checks if a community exists for validation.
// @access  public
router.get("/", async (req, res) => {
    dbDebugger("input:", req.query);
  let check;
  try {
    check = await Community.find({
      creatorBaandaId: req.query.baandaid,
      commName: req.query.commName
    });
    if ( check.length > 0) {
        throw new Error(`The communityName: ${req.query.commName} for bid: ${req.query.baandaid} already exists.`);
    } else {
        res.status(200).json({status: "Success", Msg: ''})
    }
  } catch (err) {
    dbDebugger("Error:", err.message);
    res.status(200).json({status: "Fail", Msg: err.message})
  }
});

module.exports = router;
