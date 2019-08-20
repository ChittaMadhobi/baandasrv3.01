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
    dbDebugger('Req.query:', req.query)
    try {
        let ret = await Catalog.find( {itemId: req.query.itemId })
        dbDebugger('ret:', ret);
        res.status(200).send({status: 'Success', Msg: ret});
    } catch (err) {
        dbDebugger('Err:' , err.message);
        res.status(400).json({status: 'Error', Msg: err.message});
    }
});

module.exports = router;