/*
 ** Description: This is invoked when updating existing group.
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
const logger = require("../../utils/loggerSetup");

// DB Schemas
const Group = require("../../models/group");
// const groupID = require("../../models/groupID");


// @route   POST /routes/dashboard/createNewGroup
// @desc    Saves a new catalog item.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
    console.log('req.body:', req.body, ' grp:', req.body.groupId);
    try {
        // let grpUpdt = await Group.find({ $and: [ { communityId: req.body.communityId}, { groupId: req.body.groupId }] });
        let filter = { $and: [ { communityId: req.body.communityId}, { groupId: req.body.groupId }] };
        let update = { $set: {
            groupName: req.body.groupName,
            description: req.body.groupDescription
        }};
        let options = { new:true };
        // let grpUpdt = await Group.findOneAndUpdate({ $and: [ { communityId: req.body.communityId}, { groupId: req.body.groupId }] }, update, options);
        let grpUpdt = await Group.findOneAndUpdate(filter, update, options);
        console.log('grpUpdt:', grpUpdt );
        if ( grpUpdt ) {
            res.status(200).json({ status: 'Success', Msg: grpUpdt });
        } else {
            res.status(200).json({ status: 'Error', Msg: `No record found with communityId ${req.body.communityId} & groupId ${req.body.groupId}` });
        }
    } catch(err) {
        res.status(400).json({ status: 'Error', Msg: err.message});
    }
    // res.send('in updateGroup');
});

module.exports = router;