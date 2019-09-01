/*
 ** Description: Send invite emails to members and change their state.
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
const logger = require("../../utils/loggerSetup");

// DB Schemas
const Group = require("../../models/group");

// @route   POST /routes/dashboard/saveInviteLetter
// @desc    Save & get (conditionally) members of a group.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  dbDebugger("sendInvite.. req.body:", req.body) 

  try {
    // 1. Update the group's inviteLetter
    let filter = {
      communityId: req.body.communityId,
      groupId: req.body.groupId
    };
    let ret = await Group.findOneAndUpdate(
      filter,
      { $set: { inviteLetter: req.body.inviteLetter } },
      { new: true }
    ).select("-_id inviteLetter");
;
    res.status(200).json({ status: 'Success', Msg: ''});

  } catch(err) {
      dbDebugger('Err:', err.message);
      res.status(400).json({ status: "Error", Msg: err.message});
  }

});

module.exports = router;