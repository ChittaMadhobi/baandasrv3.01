/*
 ** Description: returns community info as needed. 
 ** #1: joiningProcess
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
// Utlity sort
const msort = require("../../utils/sortOn");

// DB Schemas
const Commuity= require("../../models/community");

// @route   GET /routes/dashboard/getCommunityInfo
// @desc    Return groups of a community.
// @access  public
router.get("/", async (req, res) => {
  dbDebugger("getGroupsOfCommunity req.query:", req.query);
  //   res.send('in getGroupsOfCommunity')
  let check;
  try {
    let filter = { communityId: req.query.communityId}
    let commInfo = await Community.find(filter).select('-_id joiningProcess');
    dbDebugger('commInfo:', commInfo);
    res.status(200).json({
        joiningProcess: commInfo[0].joiningProcess
    })
  } catch (err) {
    dbDebugger("Error:", err.message);
    res.status(400).json({ status: "Error", Msg: err.message });
  }
});

module.exports = router;