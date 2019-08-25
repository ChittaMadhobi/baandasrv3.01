/*
 ** Description: Post user's profile (init and/or edited versions)
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
const logger = require("../../utils/loggerSetup");

// DB Schemas
const Group = require("../../models/group");
const User = require("../../models/user");

// @route   POST /routes/dashboard/saveGetGroupMembbers
// @desc    Save & get (conditionally) members of a group.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {

  let output = "";

  let ret = await Group.find({
    communityId: req.body.communityId,
    groupId: req.body.groupId
  });

  //   console.log("ret before:", ret[0]);

  if (req.body.requestType === "AddSelectMembers") {
    let bid = 0;
    if ( req.body.member.baandaId === 0) {
        let bidget = await User.find({ email: req.body.member.email}).select('-_id baandaId');
        // console.log('>>>>>>>>>>>>>>>>>>>>>> bidget:', bidget);
        // Need to test when we form few baanda members and use them for new member.
        if ( bidget.length !== 0 ) {
            bid = bidget[0].baandaId;
            // console.log('found baanaId for email:', bidget[0].baandaId);
        }
    } else  {
        bid = req.body.member.baandaId;
    }
    let newMember = {
      baandaId: bid,
      email: req.body.member.email,
      memberName: req.body.member.memberName,
      cell: req.body.cell,
      inviteSent: false,
      response: "No-response",
      joinDate: Date.now(),
      role: req.body.member.role
    };
    // console.log('newMember:', newMember);
    let filter = {
      communityId: req.body.communityId,
      groupId: req.body.groupId
    };
    let update = { $push: { members: newMember } };
    let options = { safe: true, new: true };
    let pushRet = await Group.findOneAndUpdate(filter, update, options);

    output = pushRet.members;
  } else {
    output = ret[0].members;
    // console.log("%%% output:", output);
  }

  let yy = output.sort(sortOn("memberName", req.body.ascDsc));
  // console.log("### output:", output);
  res.send(yy);
});

module.exports = router;

function sortOn(property, AscDsc) {
  if (AscDsc === "asc") {
    return function(a, b) {
      if (a[property] > b[property]) {
        return -1;
      } else if (a[property] < b[property]) {
        return 1;
      } else {
        return 0;
      }
    };
  } else {
    return function(a, b) {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      } else {
        return 0;
      }
    };
  }
}
