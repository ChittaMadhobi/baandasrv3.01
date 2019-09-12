const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const invoiceSchema = new mongoose.Schema({
  invoiceOfBaandaId: {
    type: Number,
    required: true
  },
  invoiceId: {
    type: Number,
    required: true
  },
  invoiceOfEmail: {
      type: String,
      required: true
  },
  customerName: {
    type: String,
    default: ''
  },
  communityId: {
      type: Number,
      required: true
  },
  invoiceDate: {
      type: Date,
      default: Date.now()
  },
  invoiceType: { type: String, default: 'receiveable'},
  paySchedule: {
      value: { type: String, required: true},
      label: { type: String, required: true}
  },
  paySchedulePolicy: {
    installmentType: { type: String, enum: [ '', 'monthly', 'bi-monthly', 'weekly', 'bi-weekly']},
    payByDateOfMonth: { type: Number, default: 0},
    payByDayOfWeek: { type: String, enum: ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    nextSchedulePayday: { type: Date, default: null}   // used for both installment & partpay
  },
  paidUpFlag: { type: Boolean, default: false},
  financeBreakdown: {
    totalInvoiceAmount: { type: Number, required: true},
    amountPaid: { type: Number, default: 0},
    lastPaymentDate: { type: Date, default: null},
    discountAmount: { type: Number, default: 0},
    taxAmount: { type: Number, default: 0},
    baandaServiceFee: { type: Number, default: 0}
  }, 
  itemDetails: [
    {
        itemId: { type: Number, required: true},
        itemName: { type: String, required: true},
        itemUnit: { type: String, enum: [ 'number', 'weight', 'volume'], default: 'number'},
        unitName: { type: String, default: 'each'},
        price: { type: Number, default: 0},
        quantity: { type: Number, default: 0},
        cost: { type: Number, default: 0}
    }
  ],
  invoiceNote: { type: String, default: ''},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  updated_by_bid: {
    type: Number,
    required: true
  }
});

invoiceSchema.index({ invoiceId: 1 }, { unique: true });
invoiceSchema.index({ email: 1, invoiceBaandaId: 1 }, { unique: false });

module.exports = Invoice = mongoose.model("invoice", invoiceSchema);