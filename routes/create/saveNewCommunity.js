/*
 ** Description: Post user's profile (init and/or edited versions)
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
const logger = require("../../utils/loggerSetup");

// DB Schemas
const Community = require("../../models/community");
const AccessList = require("../../models/accessList");
// const BaandaID = require("../../models/baandaID");
const CommunityID = require('../../models/commuityID');

// @route   POST /routes/create/saveNewCommunity
// @desc    Saves a new community (Creation).
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  dbDebugger("Inside save new community", req.body);

  // Start the session pivoted around  creating community
  const session = await Community.startSession();
  session.startTransaction();
  try {
    let check = await Community.find({
      creatorBaandaId: req.body.baandaid,
      commName: req.body.commName
    });
    dbDebugger("check:", check, " length:", check.length);
    if (check.length === 0) {
      const opts = { session };
      let commid = await CommunityID.findOneAndUpdate({
        ref: "community-id",
        $inc: {
          newcommunityid: 1
        }
      });
      let geoInfo = JSON.stringify(req.body.locationCurr);
      let addr = {
        street: req.body.postalAddress.street,
        city: req.body.postalAddress.city,
        state: req.body.postalAddress.state,
        zip: req.body.postalAddress.zip,
        country: req.body.postalAddress.country
      }
      dbDebugger("=============== #$#$ communityId:", commid.newcommunityid);
      let location = {
        addressType: req.body.locationType,
        postalAddress: JSON.stringify(addr),
        geoCentricInfo: geoInfo
      }
      // Create a community schema
      let community = new Community({
        creatorBaandaId: req.body.baandaid,
        communityId: commid.newcommunityid, 
        commName: req.body.commName,
        commCaption: req.body.commCaption,
        commDescription: req.body.commDescription,
        intent: req.body.intent,
        intentFocus: req.body.focus,
        searchWords: req.body.searchWords,
        joiningProcess: req.body.joiningProcess,
        fileUploads: req.body.fileUploads,
        centerOfActivityLocation: location,
        updated_at: Date.now(),
        updated_by_bid: req.body.baandaid
      });
      // save
      const retCommunity = await community.save(opts);
      // const retCommunity = await community.save();

      let accessList = new AccessList({
        baandaId: req.body.baandaid,
        communityId: commid.newcommunityid,
        commName: req.body.commName,
        commCaption: req.body.commCaption,
        intent: req.body.intent,
        intentFocus: req.body.focus,
        role: "Creator",
        updated_at: Date.now(),
        updated_by_bid: req.body.baandaid
      });

      const retAccessList = await accessList.save(opts);
      // const retAccessList = await accessList.save();

      await session.commitTransaction();
      session.endSession();

      // return the success message
      dbDebugger("Community Saved:", retCommunity);
      dbDebugger("AccessList Saved:", retAccessList);
      //   dbDebugger("Community Saved:", retCommunity);
      //   dbDebugger("AccessList Saved:", retAccessList);

      // throw error if not successful.
      res
        .status(200)
        .json({ status: "Success", Msg: "Save new community in DB" });
    } else {
      throw new Error(
        `Community name ${
          req.body.commName
        } already exists. To change use Edit button on top.`
      );
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    dbDebugger("err:", err);
    logMsg = {
      type: "API",
      domain: "NewCommunitySave",
      msg: `ERROR: ${err.message} for baandaId: ${req.body.baandaid}`
    };
    logger.info(JSON.stringify(logMsg));
    let errMsg = { status: "Error", Msg: err.message };
    dbDebugger("==================================================");
    dbDebugger("logMsg:", err.message);
    dbDebugger("==================================================");
    res.status(400).json(errMsg);
  }
});

module.exports = router;
