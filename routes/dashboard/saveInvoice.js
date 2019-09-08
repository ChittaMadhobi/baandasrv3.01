/*
 ** Description: Save invoice & payment and send invoices to customer.
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
// const logger = require("../../utils/loggerSetup");

// Make a sendInvoiceEmail module in utils
const sendInvoiceEmail = require("../../utils/sendInvoiceEmail");

// DB Schemas
const Invoice = require("../../models/invoice");
const Payment = require("../../models/payment");
const AllBaandaId = require('../../models/allBaandaID');
const User = require('../../models/user');
const Catalog = require('../../models/catalog');

// @route   POST /routes/dashboard/saveInvoice
// @desc    Save & get (conditionally) members of a group.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  let rb = req.body;
  // console.log("req.body:", rb);
  
  // const session = await Invoice.startSession();
  // session.startTransaction();
  try {
    let newInvoiceId = await AllBaandaId.findOneAndUpdate(
      { ref: "invoice-id" },
      {
        $inc: {
          newbaandadomainid: 1
        }
      }
    );

    let invoice = new Invoice({
        invoiceOfBaandaId: rb.invoiceOfBaandaId,
        invoiceId: newInvoiceId.newbaandadomainid,
        invoiceOfEmail: rb.invoiceOfEmail,
        customerName: rb.customerName,
        communityId: rb.communityId,
        paySchedule: rb.paySchedule,
        paySchedulePolicy: rb.paySchedulePolicy,
        financeBreakdown: rb.finBreakdown,
        itemDetails: rb.itemDetails,
        invoiceNote: rb.invoiceNote,
        updated_at: Date.now(),
        updated_by_bid: rb.updatedBy
    });

    // const opts = { session };

    // let retIsave = await invoice.save(opts);  // Don't forget to include opts 
    let retIsave = await invoice.save();  // Don't forget to include opts 
    // console.log('--------------------- Invoice Saving output ----------------');
    // console.log('New Invoice Id:', newInvoiceId.newbaandadomainid);
    if ( !retIsave.communityId ) {
        throw new Error('Failed to save the invoice without system leve error.');
    }
    // console.log ('retIsave:', retIsave);

    let newPaymentId = await AllBaandaId.findOneAndUpdate(
        { ref: "payment-id" },
        {
          $inc: {
            newbaandadomainid: 1
          }
        }
      );

    // console.log ('newPaymentId:', newPaymentId.newbaandadomainid);
    let payment = new Payment({
        paymentType: 'receiveable',
        paymentId: newPaymentId.newbaandadomainid,
        invoiceId: newInvoiceId.newbaandadomainid,
        customerBaandaId: rb.invoiceOfBaandaId,
        customerEmail: rb.invoiceOfEmail,
        customerName: rb.customerName,
        paymentAmount: rb.finBreakdown.amountPaid,
        updated_by_bid: rb.updatedBy
    });
    
    // // console.log('===================== Payment Saving output ====================');
    // // console.log('New Invoice Id:', newInvoiceId.newbaandadomainid);
    let retPsave = await payment.save();
    if ( !retPsave.paymentId) {
        throw new Error('Failed to save the invoice without system leve error.');
    }
    // Update inventory in Catalog for each item sold.
    let filterc; 
    rb.itemDetails.forEach(async obj => {
      filterc = { communityId: rb.communityId, itemId: obj.itemId};
      await Catalog.findOneAndUpdate( filterc, { $inc: { currentInventory: (obj.quantity * -1) }});
    });


    // console.log('retPsave: ', retPsave);
    // await session.commitTransaction();
    // session.endSession();
    let filter = { baandaId: rb.updatedBy}
    // console.log('filter:', filter);
    let retUser = await User.find(filter).select('-_id name email');

    let emailData = {
        orgName: "The Gaia School of Healing & Earth",
        orgType: "Education, California",
        items: rb.itemDetails,
        invoiceId: newInvoiceId.newbaandadomainid,
        customerName: rb.customerName,
        finBreakdown: rb.finBreakdown,
        paySchedule: rb.paySchedule,
        paySchedulePolicy: rb.paySchedulePolicy,
        invoiceNote: rb.invoiceNote,
        senderName: retUser[0].name,
        senderEmail: retUser[0].email
    }
    // console.log('emailData.items:', emailData.items);
    let retEmail = await sendInvoiceEmail(emailData);
    // console.log('sendInvoice retEmail:', retEmail);

    res.send('Successful');
  } catch (err) {
    // await session.abortTransaction();
    // session.endSession();  
    console.log("Error: ", err.message);
    // Send gaby error email with req.body and error message.
    res.send('Failed to save and send invoice') ;
  }

});

module.exports = router;
