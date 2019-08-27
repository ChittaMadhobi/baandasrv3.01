/*
 ** Description: Updates inventory and adjusts current inventory in catalog
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
const logger = require("../../utils/loggerSetup");

// DB Schemas
const Inventory = require("../../models/inventory");
// const TransactionID = require("../../models/transactionID");
const AllBaandaId = require('../../models/allBaandaID');
const Catalog = require("../../models/catalog");

// @route   POST /routes/dashboard/updateInventory
// @desc    Saves a new inventory transaction and updates current enventory in catalog.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  dbDebugger('UodateInventory req.body:', req.body);

  const session = await Inventory.startSession();
  session.startTransaction();
  try {

    let transIdObj = await AllBaandaId.findOneAndUpdate(
      {ref: "transaction-id"},
      {
        $inc: {
          newbaandadomainid: 1
        }
      }
    );
    let newtransactionId = transIdObj.newbaandadomainid;

    dbDebugger('$$$$ transid=', newtransactionId);
    let opts;
    if ( newtransactionId  > 0) {
        dbDebugger('Defining opts');
        opts = { session };
    } else {
        throw new Error('Unable to get a new transactionid.')
    }
    let originTrId;
    if (req.body.transactionOrigin === "Adjustment") {
      originTrId = newtransactionId;
    } else {
      originTrId = req.body.originTransId;
    }

    let currInv = 0;
    if (req.body.adjustmentType === "Add") {
      currInv = req.body.inventoryQty;
    } else {
      currInv = req.body.inventoryQty * -1;
    }

    let inventory = new Inventory({
      communityId: req.body.communityId,
      itemId: req.body.itemId,
      adjustmentType: req.body.adjustmentType,
      inventoryQty: req.body.inventoryQty,
      unit: req.body.unit,
      comment: req.body.comment,
      trasnsactionOrigin: req.body.transactionOrigin,
      thisTransId: newtransactionId,
      originTransId: originTrId,
      updated_at: Date.now(),
      updated_by_bid: req.body.baandaId
    });

    const retInv = await inventory.save(opts);
    // check if a required field does not exist throw error
    if (!retInv.comment) {
        throw new Error('Failed to insert a row in inventory');
    }
     let cat = await Catalog.findOneAndUpdate(
      {
        communityId: req.body.communityId,
        itemId: req.body.itemId
      },
      {
        $inc: {
          currentInventory: currInv
        }
      },
      { new: true }
    );
    if ( !cat.itemId) {
        throw new Error(`Failed to increment the Catalog inventory ... rolling back trans# ${transid.transactionid}.`)
    }
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ status: 'Success', Msg: 'Inventory saved and catalog inventory adjusted.'})

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    dbDebugger("Err:", err.message);
    let errMsg = { status: "Error", Msg: err.message};
    res.status(400).json(errMsg);
  }
});

module.exports = router;
