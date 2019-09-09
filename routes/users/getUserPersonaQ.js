/*
** Description: Gets user persona questions to be answered by frontend
*/
const express = require("express");
const router = express.Router();

const logger = require('../../utils/loggerSetup');

const UserPersona = require("../../models/userPersona");
const dbDebugger = require("debug")("app:db");
// const logger = require('../utils/loggerSetup');

// @route   GET /routes/users/getUserPersonaQ
// @desc    Returns the init questions to the client.
// @access  Public
router.get("/", async (req, res) => {
    dbDebugger('Getting UserPersona via (getUserPersonaQ line 15) for id: ' + req.query.baandaid);
    let logMsg;
    // console.log('Getting UserPersona via (getUserPersonaQ line 12) for id: ' + req.query.baandaid);
    try {
        let userpersona = await UserPersona.findOne({baandaId: req.query.baandaid}).select("-_id persona_qa_set");
        // dbDebugger('userPersona: ', userpersona);
        if (!userpersona) {
            throw new Error('No data available for baandaID <' + req.query.baandaid + ">");
        }
        
        let toFilter = userpersona.persona_qa_set;
        dbDebugger('toFilter[0]: ', toFilter[0]);
        let i = 0, filterdArry=[];
        toFilter.forEach(row => {
            // if (!row.init_question_flag) {
                if ( i < 2 ){
                    dbDebugger('>>>>>>>>> ' +i+'. ', row );
                }
                filterdArry.push(row);    
                i++;
            // }
        });
        // console.log('filteredArry: ', filterdArry);
        // sort the filtered array by seq_no
        let sortedArray = filterdArry.sort(function(a, b){
            return a.seq_no - b.seq_no;
        })
        dbDebugger('Number of recs:' + filterdArry.length);
        res.status(200).json(sortedArray);    
    } catch (err) {
        // res.status(400).json(err);
        console.log('err:', err);
        logMsg = { type: "Persona Q ", domain: "getUserPersonaQ ", msg: `Error: ${err.message}` };
        logger.info(JSON.stringify(logMsg));
        return res.status(400).json(err);
    }
});

module.exports = router;