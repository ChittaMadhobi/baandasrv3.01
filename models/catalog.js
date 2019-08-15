const mongoose = require("mongoose");

// Catalog is for market space
const catalogSchema = new mongoose.Schema({
  communityId: {
    type: Number,
    required: true
  },
  commName: {
    type: String,
    required: true
  },
  itemId: {
    type: Number,
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  itemCategory: {
    type: String,
    default: ''
  },
  itemType: {
    type: String,
    required: true
  },
  itemDescription: {
    type: String,
    required: true
  },
  itemPrice: {
    type: Number,
    required: true
  },
  unitType: {
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
  isPublished: {
    type: Boolean,
    default: true
  },
  admins: [
    {
      role: {
        type: String,
        // default: 'aaa'
        required: true
      },
      baandaId: {
        type: Number,
        // default: 101,
        required: true
      }
    }
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  updated_by_bid: {
    type: Number,
    required: true
  }
});

catalogSchema.index({ communityId: 1, itemName: 1 }, { unique: true });

module.exports = Catalog = mongoose.model("catalog", catalogSchema);
