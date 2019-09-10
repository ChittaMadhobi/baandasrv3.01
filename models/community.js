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
      type: Object,
      default: null
    },
    geoCentricInfo: {
      type: Object,
      default: null
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
  peerCommunities: [{
    peerCommunityId: { type: Number, default: 0},
    requestInitiator: { type: String, default: ''},  // self or other
    dateOfRequest: { type: Date, default: null},
    response: { type: String, default: ''},  // no-response, accepted, declined
    relationType: { type: String, default: ''}, // peer, parentof, childof
    exchangeNotes: [{
      seqNo: { type: Number, default: 0},
      note: { type: String, default: ''},
      sentiment: { type: Number, default: 0},
      date: { type: Date, default: null},
      exchangeType: { type: String, default: '' },  // sent, received
      attachmentUrl: { type: String, default: '' }
    }]
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
