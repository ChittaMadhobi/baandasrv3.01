/*
 ** Description: Send invite emails to members and change their state.
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
const logger = require("../../utils/loggerSetup");

const sendEmail = require("../../utils/sendEmail");

// DB Schemas
const Group = require("../../models/group");

//  @route   POST /routes/dashboard/saveInviteAndSend
// @desc    Save & get (conditionally) members of a group.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  dbDebugger("sendInvite.. req.body:", req.body);
  try {
    let filter = {
      communityId: req.body.communityId,
      groupId: req.body.groupId
    };
    let ret = await Group.findOneAndUpdate(
      filter,
      { $set: { inviteLetter: req.body.inviteLetter } },
      { new: true }
    );

    let emailReq = {
      communityId: req.body.communityId,
      groupId: req.body.groupId,
      protocol: req.protocol,
      toEmail: req.body.email,
      subject: req.body.inviteLetter.subject,
      salute: req.body.inviteLetter.salute,
      toName: req.body.memberName,
      letterBody: req.body.inviteLetter.body,
      linkDirection: req.body.inviteLetter.acceptLink,
      signature: req.body.inviteLetter.signature
    };

    let retEmail = await sendEmail(emailReq);
    let filterMember = {
      communityId: req.body.communityId,
      groupId: req.body.groupId,
      "members.email": req.body.email
    };

    let updtMember = await Group.findOneAndUpdate(
      filterMember,
      {
        $set: { "members.$.inviteSent": true }
      },
      { new: true }
    ).select("-_id members");

    res.status(200).json({ status:"Success", Msg: ''});

  } catch (err) {
    console.log("Err:", err.message);
    res.status(400).json({ status: "Error", Msg: err.message});
  }

});

module.exports = router;
