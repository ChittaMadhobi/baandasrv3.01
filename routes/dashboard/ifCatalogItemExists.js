/*
 ** Description: Checks to see if a baandaid+commName exists
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");

// DB Schemas
const Catalog = require("../../models/catalog");

// @route   GET /routes/dashboard/ifCatalogItemExists
// @desc    Checks if a item exists for validation.
// @access  public
router.get("/", async (req, res) => {
  dbDebugger("ifCatalogItemexists req.query:", req.query);
  let check;
  try {
    check = await Catalog.find({
      communityId: req.query.communityId,
      itemName: req.query.itemName
    });
    if ( check.length > 0) {
        throw new Error(`The itemName: ${req.query.itemName} exists.`);
    } else {
        res.status(200).json({status: "Success", Msg: ''})
    }
  } catch (err) {
    dbDebugger("Error:", err.message);
    res.status(200).json({status: "Fail", Msg: err.message})
  }
});

module.exports = router;