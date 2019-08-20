/*
 ** Description: Post user's profile (init and/or edited versions)
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
const logger = require("../../utils/loggerSetup");

// DB Schemas
const Catalog = require("../../models/catalog");

// @route   POST /routes/dashboard/saveCatalogItem
// @desc    Saves a new catalog item.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  dbDebugger("updateCatalogItem req.body:", req.body);

  try {
    let ret = await Catalog.find({ itemName: req.body.itemName }).select(
      "-_id itemId"
    );
    dbDebugger("ret: ", ret);
    ret.forEach(obj => {
      dbDebugger(
        "obj.itemId:" + obj.itemId + " req.body.itemId:" + req.body.itemId
      );
      if (obj.itemId !== req.body.itemId) {
        dbDebugger(
          "There exists a different item with the name <" +
            req.body.itemName +
            ">"
        );
        throw new Error("The item name exists. Use uniqe item name.");
      }
    });

    let fileLoad = [
      {
        key: req.body.fileUploads[0].key,
        type: req.body.fileUploads[0].type,
        caption: req.body.fileUploads[0].caption,
        s3Url: req.body.fileUploads[0].s3Url
      }
    ];
    dbDebugger("fileLoad==>>>>>>>>>>>>>>>>", fileLoad);

    let item = {
      itemName: req.body.itemName,
      itemCategory: req.body.itemCategory,
      itemType: req.body.merchandiseType,
      itemDescription: req.body.itemDescription,
      itemPrice: req.body.itemPrice,
      unitType: req.body.unitType,
      fileUploads: fileLoad,
      updated_by_bid: req.body.baandaId,
      updated_at: Date.now()
    };
    let upRet = await Catalog.findOneAndUpdate(
      { itemId: req.body.itemId },
      item,
      { new: true }
    );
    dbDebugger("upRet:", upRet, " length:", upRet.length);
    if (upRet.itemId === req.body.itemId) {
      dbDebugger("upRet:", upRet);
      res.status(200).json({ status: "Success", msg: upRet });
    //   res.status(400).json({ status: "Error", msg: 'Testing error condition' }); // for simulating error condition, uncomment it and comment the line above.
    } else {
      dbDebugger(
        "Something went wrong with this update. ... itemId:" +
          req.body.itemId +
          " name:" +
          req.body.itemName
      );
      throw new Error("Updating error. Please contact baanda support.");
    }
  } catch (err) {
    res.status(400).json({ status: "Error", msg: err.message });
  }
  //   res.send("Update catalog Item");
});

module.exports = router;
