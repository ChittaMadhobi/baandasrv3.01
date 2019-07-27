/*
 ** Description: This initialize personality document for a user. Get the set of questions,
 **              then creates a new document in collection userpersonas for the user with score
 **              0 (zero). This is done once only.
 */
const BigFiveQ = require("../models/bigfivequestion");
const UserPersona = require("../models/userPersona");
const dbDebugger = require("debug")("app:db");
const logger = require('../utils/loggerSetup');

// const User = require('../models/user');
// temporary
// require('../startup/dbConnection')();

initUserPersona = async baandaid => {
  let ret = {status: true, msg: 'Success'};
  dbDebugger("Inside utility utilsdb/iniUserPersona");
  try {
    const pq = await BigFiveQ.find();
    let persona_qa_set_new = [];
    let pd = {
      seq_no: 0,
      question: "",
      explanation: ""
    };

    pq.forEach(row => {
      pd = {
        seq_no: row.seq_no,
        question: row.question,
        explanation: row.explanation,
        persona_category: row.persona_category,
        sub_category: row.sub_category,
        sub_category_plus: row.sub_category_plus,
        sub_category_minus: row.sub_category_minus,
        inversion_flag: row.inversion_flag,
        init_question_flag: row.init_question_flag,
        score: 0
      };
      persona_qa_set_new.push(pd);
    });
    if (persona_qa_set_new.length === 0) {
      dbDebugger("No documents retrieved for persona_qa_set.");
      throw "No documents retrieved for persona_qa_set.";
    }
    let newUserPersona = new UserPersona({
      baandaId: baandaid,
      persona_qa_set: persona_qa_set_new,
      created_at: Date.now()
    });
    let retSave = await newUserPersona.save();
    if (retSave) {
      dbDebugger(
        "Created a new personalInfo document in userpersonas collection for baadaid:" +
          baandaid
      );
    } else {
      dbDebugger(
        "Failed to create a new persona for the baaandaid: " + baandaid
      );
      throw 'Failed to create a new persona for the baaandaid: " + baandaid';
    }
    logMsg = { type: "Application", domain: "Personality", msg: `User ${baandaid} logged in at ${loggedinat}`};
    logger.info(JSON.stringify(logMsg));
  } catch (err) {
    console.log("Error: " + err);
    ret.status = false;
    ret.msg = err;
  }

  return ret; 
};

module.exports = initUserPersona;
