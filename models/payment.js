const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const paymentSchema = new mongoose.Schema({
  paymenType: {
    type: String,
    enum: ["payable", "receivable"]
  },
  paymentId: { type: Number, required: true },
  invoiceId: { type: Number, required: true },
  customerBaandaId: {
    type: Number,
    default: 0
  },
  customerEmail: { type: String, required: true},
  customerName: { type: String, default: ''},
  currencyType: { type: String, default: 'fiat'},
  currencyName: { type: String, default: 'dollar'},
  PaymentMedium: { type: String, enum: ['cc', 'cash', 'crypto'], default: 'cash' },
  paymentAmount: { type: Number, default: 0},
  paid_at: { type: Date, default: Date.now },
  updated_by_bid: {
    type: Number,
    required: true
  }
});

paymentSchema.index({ paymentId: 1 }, { unique: true });
// customerSchema.index({ email: 1, customerBaandaId: 1 }, { unique: false });

module.exports = Payment = mongoose.model("payment", paymentSchema);
