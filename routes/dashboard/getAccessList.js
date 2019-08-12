/*
 ** Description: Checks to see if a baandaid+commName exists
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");

// DB Schemas
const AccessList = require("../../models/accessList");

// @route   GET /routes/create/checkIfCommunityExists
// @desc    Checks if a community exists for validation.
// @access  public
router.get("/", async (req, res) => {
    console.log('req.query:', req.query);
    try {
        let accesslist = await AccessList.find({ baandaId: req.query.baandaid}).exec();
        console.log('accesslist:', accesslist);
        res.send(accesslist);
    } catch(err) {
        console.log("AL Error:", err.message);
        res.send(err.message);
    }
    // AccessList.find({ baandaId: req.query.baandaid })
});

module.exports = router;
