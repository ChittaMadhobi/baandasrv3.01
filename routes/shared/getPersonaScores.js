/*
** Description: Gets user persona scores post calculations. 
*/
const express = require("express");
const router = express.Router();

const User = require("../../models/user");
const dbDebugger = require("debug")("app:db");
// const logger = require('../utils/loggerSetup');

// @route   GET /routes/shared/getPersonaScores
// @desc    Returns the init questions to the client.
// @access  Public
router.get("/", async (req, res) => {
    dbDebugger('req.query:', req.query);
    // let userpersona = await User.findOne({baandaId: req.query.baandaid}).select("-_id persona_qa_set");
    let userpersona;
    try {
        userpersona = await User.findOne({baandaId: req.query.baandaid}).select("-_id persona");
        if (!userpersona) {
            throw new Error('No persona available for the baandaid:' + req.query.baandaid);
        }
    } catch (err) {
        res.status(400).json('Error: ' + err);
        return;
    }
    dbDebugger(userpersona);
    res.status(200).json(userpersona);
});

module.exports = router;