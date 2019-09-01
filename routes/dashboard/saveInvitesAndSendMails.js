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
// const User = require("../../models/user");
var interval = 2000; // how much time should the delay between two iterations be (in milliseconds)?
var promise = Promise.resolve();
let date = new Date();

// @route   POST /routes/dashboard/saveInviteAndSend
// @desc    Save & get (conditionally) members of a group.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  dbDebugger("sendInvite.. req.body:", req.body);
  // Will send one email at a time. In future, the DB updates and email request
  // would be via message queue. This single-thread js way is for Sep 10. 2019
  // release 1 to production.

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
    ).select("-_id members");

    // 2. forEach member
    let errMsg = "";
    let forEachState = true;
    let i = 0;
    let filter1;

    ret.members.forEach(async element => {
      promise = promise.then(async function() {
        // For throtteling
        if (element.role !== "Creator") {
          emailReq = {
            communityId: req.body.communityId,
            groupId: req.body.groupId,
            protocol: req.protocol,
            toEmail: element.email,
            subject: req.body.inviteLetter.subject,
            salute: req.body.inviteLetter.salute,
            toName: element.memberName,
            letterBody: req.body.inviteLetter.body,
            linkDirection: req.body.inviteLetter.acceptLink,
            signature: req.body.inviteLetter.signature
          };
          // 2.b sendEmail
          let retEmail = await sendEmail(emailReq);
          n = date.getTime();
        //   dbDebugger("sendMail Email:", i, ".", element.email, " at:", n);

          // if (retEmail.outcome) {
          let filterMember = {
            communityId: req.body.communityId,
            groupId: req.body.groupId,
            "members.email": element.email
          };

          // 2.c If true ... update group's member array object

          let updtMember = await Group.findOneAndUpdate(
            filterMember,
            {
              $set: { "members.$.inviteSent": true }
            },
            { new: true }
          ).select("-_id members");
          //   dbDebugger("updateMember: ", i, '.', updtMember);
          i++;
        }

        return new Promise(function(resolve) {
          setTimeout(resolve, interval);
        });
      });
      //   dbDebugger("email:", element.email, " name:", element.memberName);
      // 2.a create emailReq

      // next
    });

    res.status(200).json({ status: "Success", Msg: "" });
  } catch (err) {
    console.log("Err:", err.message);
    res.status(400).json({ status: "Error", Msg: err.message });
  }
});

module.exports = router;
