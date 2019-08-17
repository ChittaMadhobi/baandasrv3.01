const mongoose = require("mongoose");

// Catalog is for market space
const buySellAdjustItemSchema = new mongoose.Schema({
  transactionType: {
    type: [{ type: String, enum: ["buy", "sell", "adjust"] }],
    default: ["sell"]
  },
  communityId: {
    type: Number,
    required: true
  },
  items: [
    {
      itemId: {
        type: Number,
        required: true
      },
      itemName: {
        type: String,
        required: true
      },
      itemPrice: {
        // It may vary over time in catalog
        type: Number,
        required: true
      },
      quantity: {
        // It may vary over time in catalog
        type: Number,
        required: true
      }
    }
  ],
  operation: {
    // Add or subtracts to the current inventory in catalog.
    type: [{ type: String, enum: ["add", "subtract"] }],
    default: ["subtract"]
  },
  customer: {
    name: { type: String, default: "" },
    email: { type: String, default: email },
    baandaId: { type: Number, default: 0 },
    cell: { type: Number, default: 0 }
  },
  comment: {
    type: String,
    default: ""
  }
});

// catalogSchema.index({ communityId: 1, itemName: 1 }, { unique: true });

module.exports = buySellAdjustItem = mongoose.model(
  "buyselladjustitem",
  buySellAdjustItemSchema
);
