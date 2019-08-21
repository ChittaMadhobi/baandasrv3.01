const mongoose = require("mongoose");

// Catalog is for market space
const inventorySchema = new mongoose.Schema({
  communityId: {
    type: Number,
    required: true
  },
  itemId: {
    type: Number,
    required: true
  },
  adjustmentType: {
    type: String,
    required: true
  },
  inventoryQty: {
      type: Number,
      required: true
  },
  unit: {
    type: String,
    default: 'each'
  },
  comment: {
    type: String,
    default: ""
  },
  trasnsactionOrigin: {
      type: String,
      required: true    // This tells POS, PO, 
  },
  thisTransId: {
      type: Number,
      required: true
  },
  originTransId: {       // POS number, PO number, Adjustment etc. 
      type: Number,
      default: 0
  },
  updated_at: { type: Date, default: null },
  updated_by_bid: {
    type: Number,
    required: true
  }
});

inventorySchema.index({ communityId: 1, itemId: 1, thisTransId: 1 }, { unique: true });
// catalogSchema.index({email: “text”,name: “text”}, {weights: {email: 1,name: 2}})

module.exports = Inventory = mongoose.model("inventory", inventorySchema);
