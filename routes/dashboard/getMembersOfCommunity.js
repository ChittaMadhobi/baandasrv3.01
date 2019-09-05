/*
 ** Description: returns community info as needed.
 ** #1: joiningProcess
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
// Utlity sort
// const msort = require("../../utils/sortOn");

// DB Schemas
const Group = require("../../models/group");

// @route   GET /routes/dashboard/getMembersOfCommunity
// @desc    Return groups of a community.
// @access  public
router.get("/", async (req, res) => {
    dbDebugger("req:", req.query);
  try {
    let filter = {
      communityId: req.query.communityId
    };
    let ret = await Group.find(filter).select("-_id members");
    dbDebugger('ret:', ret.length);
    res.status(200).send({status: 'Success', Msg: ret});
  } catch (err) {
    console.log('Err:', err.message);
    res.status(200).send({status: 'Error', Msg: err.message});
  }
});

module.exports = router;