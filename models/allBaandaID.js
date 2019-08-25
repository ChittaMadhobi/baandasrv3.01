const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This will have on row always. Will be used once per user over user's life.
// Create Schema
const allBaandaIdSchema = new Schema({
  ref: {
    type: String,
    required: true
  },
  newbaandadomainid: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('AllBaandaId', allBaandaIdSchema);