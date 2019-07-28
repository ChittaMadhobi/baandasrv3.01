/*
** Description: Gets user persona questions to be answered by frontend
*/
const express = require("express");
const router = express.Router();

const UserPersona = require("../../models/userPersona");
const dbDebugger = require("debug")("app:db");
// const logger = require('../utils/loggerSetup');

// @route   GET /routes/users/getUserPersonaQ
// @desc    Returns the init questions to the client.
// @access  Public
router.get("/", async (req, res) => {
    dbDebugger('Getting UserPersona via (getUserPersonaQ line 12) for id: ' + req.query.baandaid);
    // console.log('Getting UserPersona via (getUserPersonaQ line 12) for id: ' + req.query.baandaid);
    try {
        let userpersona = await UserPersona.findOne({baandaId: req.query.baandaid}).select("-_id persona_qa_set");
        if (!userpersona) {
            throw new Error('No data available for baandaID <' + req.query.baandaid + ">");
        }
        
        let toFilter = userpersona.persona_qa_set;
        let i = 0, filterdArry=[];
        toFilter.forEach(row => {
            if (row.init_question_flag) {
                // console.log(i+'. ', row );
                filterdArry.push(row);    
                i++;
            }
        });
        // sort the filtered array by seq_no
        let sortedArray = filterdArry.sort(function(a, b){
            return a.seq_no - b.seq_no;
        })
        // console.log('Number of recs:' + filterdArry.length);
        res.status(200).json(sortedArray);    
    } catch (err) {
        // res.status(400).json(err);
        console.log('err:', err);
        return res.status(400).json(err);
    }
});

module.exports = router;