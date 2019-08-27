/*
 ** Description: Update/pull (delete) members from a group by Creator.
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
const logger = require("../../utils/loggerSetup");

// DB Schemas
const Group = require("../../models/group");

// Utlity sort
const msort = require("../../utils/sortOn");

// @route   POST /routes/dashboard/deleteGroupMembbers
// @desc    Save & get (conditionally) members of a group.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  dbDebugger("req.body:", req.body);

  let filter = { communityId: req.body.communityId, groupId: req.body.groupId };
  try {
    let ret1 = await Group.findOneAndUpdate(filter, {
      $pull: { members: { email: req.body.email } }
    });
    let ret = await Group.find(filter).select("-_id members");

    dbDebugger("ret:", ret[0], " length:", ret[0].members.length);

    let sorted = msort(ret[0].members, "memberName", req.body.ascDsc);
    res.status(200).json(sorted);
  } catch (err) {
    dbDebugger("err:", err.message);
    res.status(400).json({ status: "Error", Msg: err.message });
  }
});

module.exports = router;
