const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const communitySchema = new mongoose.Schema({
  creatorBaandaId: {
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
  commDescription: {
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
  searchWords: [
    {
      type: String,
      default: ""
    }
  ],
  joiningProcess: {
    type: String,
    required: true
  },
  fileUploads: [
    {
      key: { type: String },
      type: { type: String },
      s3Url: { type: String },
      caption: { type: String }
    }
  ],
  publishedFlag: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  centerOfActivityLocation: {
    addressType: {
      type: String,
      default: "Current"
    },
    postalAddress: {
      type: String,
      default: ""
    },
    geoCentricInfo: {
      type: String,
      default: ""
    }
  },
  createdGroups: [{
    groupdId: {
      type: Number,
      default: 0
    },
    groupName: {
      type: String,
      default: ''
    }
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  updated_by_bid: {
    type: Number,
    required: true
  }
});

communitySchema.index({ creatorBaandaId: 1, commName: 1 }, { unique: true });

module.exports = Community = mongoose.model("community", communitySchema);
