/*
 ** Description: Checks to see if a baandaid+commName exists
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");

// DB Schemas

const Group = require("../../models/group")

// @route   GET /routes/dashboard/ifGroupExists
// @desc    Checks if a item exists for validation.
// @access  public
router.post("/", async (req, res) => {
  console.log('req.body:', req.body);  
 try {
    let ret = await  Group.find({ $and: [
        {communityId: req.body.communityId}, 
        { groupId: req.body.groupId}
    ]});
    // let ret = await  Group.find({ $and: [
    //     {communityId: req.body.communityId}, 
    //     { groupId: req.body.groupId},
    //     { members: { $elemMatch: { email: req.body.member.email }}} 
    // ]});

    let mm = ret[0].members;
  
    // console.log('ret:', mm);
  
    let result = mm.filter( obj => {
        return obj.email === req.body.member.email 
    });

    if (result.length === 0) {
        console.log('OK to enter the new member ...');
    } else {
        console.log('Ignore ... do not enter it again ...');
    }

    console.log('result:', result);

    res.status(200).json(mm);
 } catch(err) {
     console.log('err:', err.message);
     res.status(200).json({status: 'Error', Msg: err.message})
 }
});

module.exports = router;
// module.exports = router;