const mongoose = require("mongoose");

const bigFiveQuestionSchema = new mongoose.Schema({
    seq_no : {
        type: Number,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        default: ''
    },
    persona_category: {
        type: String,
        required: true
    },
    sub_category: {
        type: String,
        required: true
    },
    sub_category_plus: {
        type: String,
        required: true
    },
    sub_category_minus: {
        type: String,
        required: true
    },
    inversion_flag: {
        type: Boolean,
        required: true
    },
    init_question_flag: {
        type: Boolean,
        required: true
    }

});


module.exports = BigFiveQuestion = mongoose.model("bigfivequestions", bigFiveQuestionSchema);