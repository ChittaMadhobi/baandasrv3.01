/*
 ** Description: Checks to see if a baandaid+commName exists
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");

// DB Schemas
const AccessList = require("../../models/accessList");

// @route   GET /routes/dashboard/checkIfCommunityExists
// @desc    Checks if a community exists for validation.
// @access  public
router.get("/", async (req, res) => {
    dbDebugger('req.query:', req.query);
    try {
        let accesslist = await AccessList.find({ baandaId: req.query.baandaid}).exec();
        dbDebugger('accesslist:', accesslist);
        res.send(accesslist);
    } catch(err) {
        dbDebugger("AL Error:", err.message);
        res.send(err.message);
    }
    // AccessList.find({ baandaId: req.query.baandaid })
});

module.exports = router;
