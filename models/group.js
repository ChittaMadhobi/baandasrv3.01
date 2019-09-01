const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const groupSchema = new mongoose.Schema({
  communityId: {
    type: Number,
    required: true
  },
  groupId: {
    type: Number,
    required: true
  },
  groupName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  members: [
    {
      baandaId: { type: Number, default: 0 },
      email: { type: String, default: "" }, // Cannot have duplicate and hence must be tested
      cell: { type: String, default: "" },
      memberName: { type: String, default: "" },
      inviteSent: { type: Boolean, default: false },
      response: { type: String, default: "No-Response" }, // No-response, Accept, Declined
      joinDate: { type: Date, default: null },
      role: { type: String, default: "" }
    }
  ],
  inviteLetter: {
    subject: { type: String, default: "" },
    salute: { type: String, defaul: "Dear" },
    body: { type: String, default: "" },
    acceptLink: { type: String, defaul: "" },
    signature: { type: String, default: "" }
  },
  Status: {
    type: Boolean,
    default: true // Creator has to deactivate
  },
  deactivationReason: {
    type: String,
    default: ""
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  updated_by_bid: {
    type: Number,
    required: true
  }
});

groupSchema.index({ communityId: 1, groupId: 1 }, { unique: true });

module.exports = Group = mongoose.model("group", groupSchema);
