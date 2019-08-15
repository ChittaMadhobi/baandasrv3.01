/*
 ** Description: Post user's profile (init and/or edited versions)
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
const logger = require("../../utils/loggerSetup");

// DB Schemas
const Catalog = require("../../models/catalog");
const CatalogItemId = require("../../models/catalogItemID");

// @route   POST /routes/dashboard/saveCatalogItem
// @desc    Saves a new catalog item.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  console.log("Inside saveCatalogItem", req.body.fileUploads);
  try {
    let check = await Catalog.find({
      communityId: req.body.communityId,
      itemName: req.body.itemName
    });
    if (check.length === 0) {
      let itemId = await CatalogItemId.findOneAndUpdate({
        ref: "generated-item-id",
        $inc: {
          newitemid: 1
        }
      });

      let creator = [
        {
          role: "Creator",
          baandaId: req.body.baandaId
        }
      ];

      let fileLoad = [{
        key: req.body.fileUploads[0].key,
        type: req.body.fileUploads[0].type,
        caption: req.body.fileUploads[0].caption,
        s3Url: req.body.fileUploads[0].s3Url
      }];
      console.log('fileLoad==>>>>>>>>>>>>>>>>', fileLoad);

      let item = new Catalog({
        communityId: req.body.communityId,
        commName: req.body.commName,
        itemId: itemId.newitemid,
        itemName: req.body.itemName,
        itemCategory: req.body.itemCategory,
        itemType: req.body.merchandiseType,
        itemDescription: req.body.itemDescription,
        itemPrice: req.body.itemPrice,
        unitType: req.body.unitType,
        fileUploads: fileLoad,
        admins: creator,
        updated_by_bid: req.body.baandaId
      });

      console.log('item: ', item);

      const retItem = await item.save();

      console.log('ret item:', retItem );
      
      if ( retItem ) {
        res.status(200).json({ status: "Success", Msg: "Saved Successfully. Enter next item."})
      } else {
        throw new Error(`Failed to save item ${req.body.itemName}. Please notify Baanda support`);
      }
    } else {
      throw new Error(
        `Item name ${req.body.itemName} for your catalog already exists.`
      );
    }
  } catch (err) {
    // dbDebugger("SaveCatalogItem Err:", err.message);
    console.log("SaveCatalogItem Err:", err.message);
    let     logMsg = {
      type: "API",
      domain: "saveCatalogItem",
      msg: `ERROR: ${err.message} for baandaId: ${req.body.itemName}`
    };
    logger.info(JSON.stringify(logMsg));
    let errMsg = { status: "Error", Msg: err.message };
    res.status(400).json(errMsg);
  }
});

module.exports = router;
