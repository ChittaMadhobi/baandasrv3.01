const mongoose = require("mongoose");

// accessList is used in start of Dashboard for each user's accessList or workList
const accessListSchema = new mongoose.Schema({
  baandaId: {
    type: Number,
    required: true
  },
  communityId: {
    type: Number,
    required: true
  },
  commName: {
    type: String,
    required: true
  },
  commCaption: {
    type: String,
    required: true
  },
  intent: {
    type: String,
    required: true
  },
  intentFocus: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  defaultChoice: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  updated_by_bid: {
    type: Number,
    required: true
  }
});

accessListSchema.index({ creatorBaandaId: 1, commName: 1 }, { unique: true });

module.exports = AccessList = mongoose.model("accessList", accessListSchema);
