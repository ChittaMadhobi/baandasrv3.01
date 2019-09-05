/*
 ** Description: returns a list of groups of the commuity
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
// Utlity sort
const msort = require("../../utils/sortOn");
 
// DB Schemas
const Group = require("../../models/group");

// @route   GET /routes/dashboard/getGroupsOfCommunity
// @desc    Return groups of a community.
// @access  public
router.get("/", async (req, res) => {
  dbDebugger("getGroupsOfCommunity req.query:", req.query);
  //   res.send('in getGroupsOfCommunity')
  let check;
  try {
    groups = await Group.find({
      communityId: req.query.communityId,
      groupName: { $regex: req.query.groupName, $options: "i" }
    }).select("-_id groupId groupName description");
    if (groups.length === 0) {
      res
        .status(200)
        .json({
          status: "Error",
          Msg: `No groups in community: ${req.query.communityName}`
        });
    } else { 
      let sorted = msort(groups, "memberName", 'dsc');
      // console.log('getGroupsOfCommunity sorted:', sorted);
      res.status(200).json({ status: "Success", Msg: sorted });
    }
  } catch (err) {
    dbDebugger("Error:", err.message);
    res.status(400).json({ status: "Error", Msg: err.message });
  }
});

module.exports = router;
