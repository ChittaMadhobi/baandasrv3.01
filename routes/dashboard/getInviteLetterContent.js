/*
 ** Description: get invite letter contents
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");

// DB Schemas
const Group = require('../../models/group');

// @route   GET /routes/dashboard/checkIfCommunityExists
// @desc    Checks if a community exists for validation.
// @access  public
router.get("/", async (req, res) => {
    dbDebugger('req.query:', req.query);
    try {
        let filter = { communityId: req.query.communityId, groupId: req.query.groupId };
        dbDebugger('Filter 1:', filter);
        let inviteLetter = await Group.find( filter ).select('-_id inviteLetter').exec();

        res.status(200).json({ status: 'Success', Msg: inviteLetter});
    } catch(err) {
        console.log("InviteLetter Error:", err.message);
        res.status(400).json({status: 'Error', Msg: err.message});
    }
    // AccessList.find({ baandaId: req.query.baandaid })
});

module.exports = router;