/*
 ** Description: Checks to see if a baandaid+commName exists
 */
const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

const dbDebugger = require("debug")("app:db");

// DB Schemas
// const AccessList = require("../../models/accessList");

// @route   GET /routes/dashboard/checkIfCommunityExists
// @desc    Checks if a community exists for validation.
// @access  public
router.get("/", async (req, res) => {
  dbDebugger("groupInviteResponseApp req.query:", req.query);
  const baandaApp = keys.baandaApp;
  dbDebugger("BaandaApp: " + baandaApp);

  try {
    let filterMember = {
      communityId: req.query.communityId,
      groupId: req.query.groupId,
      "members.email": req.query.fromEmail
    };
    dbDebugger('groupInviteResponseApi filterMember: ', filterMember);

    let updtMember = await Group.findOneAndUpdate(
      filterMember,
      {
        $set: { "members.$.response": "Accepted" }
      },
      { new: true }
    ).select("members");
    dbDebugger("updtMember:", updtMember);
    res.redirect(baandaApp);
  } catch (err) {
    dbDebugger(
      "Invitee Response Error:",
      err.message,
      " req.query:",
      req.query
    );
    res.json({
      status: "Error",
      input: req.query,
      Message:
        "Something went wrong during acceptance process. Please send a message to jit@baanda.com with the information you are seeing to fix it. Thanks for helping and apoligies for the inconvenience."
    });
  }
});

module.exports = router;
