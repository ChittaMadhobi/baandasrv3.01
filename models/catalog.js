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
  itemName: {
    type: String,
    required: true
  },
  itemCategory: {
    type: String,
    default: ''
  },
  itemDescription: {
    type: String,
    required: true
  },
  itemPrice: {
    type: Number,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  admins: [
    {
      role: {
        type: String,
        required: true
      },
      baandaId: {
        type: Number,
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

accessListSchema.index({ creatorBaandaId: 1, commName: 1 }, { unique: true });

module.exports = Catalog = mongoose.model("catalog", catalogSchema);
