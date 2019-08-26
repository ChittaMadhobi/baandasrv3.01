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
router.get("/", async (req, res) => {
  dbDebugger("ifGroupexists req.query:", req.query);
  let check;
  try {
    check = await Group.find({
      communityId: req.query.communityId,
      groupName: req.query.groupName
    });
    if ( check.length > 0) {
        if ( req.query.groupId === '0' || req.query.groupId === 0 ) {
          res.status(200).json({status: "Error", Msg: `The groupName: ${req.query.groupName} exists.`});
        } else  {
          dbDebugger('check.groupId:', check[0].groupId, ' req.query.groupId:', req.query.groupId, ' int:', parseInt(req.query.groupId));
          if ( check[0].groupId !== req.query.groupId && check[0].groupId !== parseInt(req.query.groupId) ){
            res.status(200).json({status: "Error", Msg: `The ${req.query.groupName} is taken.`});
          } else {
            res.status(200).json({status: "Success", Msg: ''});
          }
        }
    } else {
        res.status(200).json({status: "Success", Msg: ''});
    }
  } catch (err) {
    dbDebugger("Error:", err.message);
    res.status(400).json({status: "Error", Msg: err.message})
  }
// res.send('Reached ifGroupExists');
});

module.exports = router;