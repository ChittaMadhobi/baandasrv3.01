/*
 ** Description: This is invoked when creating a new group.
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
const logger = require("../../utils/loggerSetup");

// DB Schemas
const User = require("../../models/user");
const Group = require("../../models/group");
// const groupID = require("../../models/groupID");
const AllBaandaId = require("../../models/allBaandaID");

const Community = require("../../models/community");

// @route   POST /routes/dashboard/createNewGroup
// @desc    Saves a new catalog item.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  dbDebugger("createNewGroup req.body:", req.body);

  // Start the session pivoted around  creating community
  // const session = await Group.startSession();
  // session.startTransaction();
  try {
    dbDebugger("On Inside try ... 1");
    // 0. Get creator's info from user
    let creator = await User.find({ baandaId: req.body.baandaId }).select(
      "-_id name email"
    );
    if (creator.length === 0) {
      throw new Error("Creator not found in DB. Seek Baanda support");
    }

    dbDebugger("creator : ", creator);
    // 1. Get a new groupId
    let groupIdObj = await AllBaandaId.findOneAndUpdate(
      { ref: "group-id" },
      {
        $inc: {
          newbaandadomainid: 1
        }
      }
    );
    let ngi = groupIdObj.newbaandadomainid;

    // let ngi = newGroupId.groupid;
    dbDebugger("ngi:", ngi);

    // const opts = { session };
    // 2. Save in groups
    let creatorMember = [
      {
        baandaId: req.body.baandaId,
        email: creator[0].email,
        memberName: creator[0].name,
        inviteSent: true,
        response: "Accepted",
        joinDate: Date.now(),
        role: "Creator"
      }
    ];

    dbDebugger("creatorMember:", creatorMember);

    let group = new Group({
      communityId: req.body.communityId,
      groupId: ngi,
      groupName: req.body.groupName,
      description: req.body.groupDescription,
      members: creatorMember,
      Status: true,
      updated_at: Date.now(),
      updated_by_bid: req.body.baandaId
    });
    // let ret1 = await group.save(opts);
    let ret1 = await group.save();

    dbDebugger("group.save ret1:".ret1);
    if (!ret1.groupId) {
      throw new Error("Failed to form the group. Aborting");
    }

    // 2. update the creator's user with memberOf and role=Creator
    let member = {
      communityId: req.body.communityId,
      groupId: ngi,
      role: "Creator"
    };

    let updateUserRet = await User.findOneAndUpdate(
      { baandaId: req.body.baandaId },
      { $push: { memberOf: member } },
      { safe: true, new: true, upsert: true }
      //   , opts
    );

    dbDebugger("updateUserRet:", updateUserRet);

    let newCommGroup = {
      groupdId: ngi,
      groupName: req.body.groupName
    };
    // 3. Add a field in community's array of createdGroup
    let updateCommunityRet = await Community.findOneAndUpdate(
      { communityId: req.body.communityId },
      { $push: { createdGroups: newCommGroup } },
      { safe: true, new: true, upsert: true }
      //   ,  opts
    );

    dbDebugger("updateCommunityRet:", updateCommunityRet);

    // await session.commitTransaction();
    // session.endSession();

    res.status(200).json({
      status: "Success",
      Msg: {groupId: ngi}
    });
  } catch (err) {
    // await session.abortTransaction();
    // session.endSession();
    dbDebugger("Err:", err.message);
    let errMsg = { status: "Error", Msg: err.message };
    res.status(200).json(errMsg);
  }
});

module.exports = router;
