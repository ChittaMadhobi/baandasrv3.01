const mongoose = require("mongoose");

const userPersonaSchema = new mongoose.Schema({
  baandaId: {
    type: Number,
    default: 0
  },
  persona_qa_set: [
    {
      seq_no: {
        type: Number,
        default: 0
      },
      question: {
        type: String,
        default: ""
      },
      explanation: {
        type: String,
        default: ""
      },
      persona_category: {
        type: String,
        default: ""
      },
      sub_category: {
        type: String,
        default: ""
      },
      sub_category_plus: {
        type: String,
        default: ""
      },
      sub_category_minus: {
        type: String,
        default: ""
      },
      inversion_flag: {
        type: String,
        default: ''
      },
      init_question_flag: {
        type: Boolean,
        default: false
      },
      score: {
        type: Number,
        default: 0
      }
    }
  ],
  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null }
});

module.exports = UserPersona = mongoose.model(
  "userPersona",
  userPersonaSchema
);