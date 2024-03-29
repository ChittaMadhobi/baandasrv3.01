/*
 ** Description: This module is responsible as a traffice controller of api routing
 ** Rivision Log:
 ** Author               Date        Description
 ** -----------------    ----------- -------------------------------------------------
 ** Jit (Sarbojit)       Jul 11, 19  Program initiated.
 **
 */
// const helmet = require("helmet");
// const morgan = require("morgan");
// const fs = require("fs");
// const path = require("path");
const startupDebugger = require('debug')('app:startup');
// Somewhere ... for db or other stuff we can write - port it to db modules
// const dbDebugger = require('debug')('app:db');
// To debug, go to terminal and set c:/..> set DEBUG=app:startup<,app:db> or =app:* for all for all startup related console.log
const express = require("express");

// const entryLogger = require("../middleware/logger");
const error = require('../middleware/error');
const logger = require('../utils/loggerSetup');
const register = require("../routes/users/register");
const login = require("../routes/users/login");
const verify = require("../routes/users/verify");
const dbtest = require('../routes/users/dbtest');

// Application API - Personality Intelligence related
const getUserPersonaQ = require('../routes/users/getUserPersonaQ');
const postUserPersonaScore = require('../routes/users/postUserPersonaScore');
const getPersonaScores = require('../routes/shared/getPersonaScores');
const postUserProfile = require('../routes/users/postUserProfile');

// API related to Create / Update Community
const saveNewCommunity = require('../routes/create/saveNewCommunity');
const ifCommunityExists = require('../routes/create/ifCommunityExists');

// API Dashboard Catalog
const getAccessList = require('../routes/dashboard/getAccessList');
const ifCatalogItemExists = require('../routes/dashboard/ifCatalogItemExists');
const saveCatalogItem = require('../routes/dashboard/saveCatalogItem');
const searchItemToEdit = require('../routes/dashboard/searchItemToEdit');
const getItemToEdit = require('../routes/dashboard/getItemToEdit');
const updateCatalogItem = require('../routes/dashboard/updateCatelogItem');
const updateInventory = require('../routes/dashboard/updateInventory');
const ifGroupExists = require('../routes/dashboard/ifGroupExists');
const createNewGroup = require('../routes/dashboard/createNewGroup');
const saveGetGroupMembers = require('../routes/dashboard/saveGetGroupMembers');
const getGroupsOfCommunity = require('../routes/dashboard/getGroupsOfCommunity');
const updateGroup = require('../routes/dashboard/updateGroup');
const deleteGroupMember = require('../routes/dashboard/deleteGroupMember');
const saveInvitesAndSendMails = require('../routes/dashboard/saveInvitesAndSendMails');
const groupInviteResponseApi = require('../routes/dashboard/groupInviteResponseApi');
const saveInvitesToIndvidual = require('../routes/dashboard/saveInvitesToIndvidual');
const getInviteLetterContent = require('../routes/dashboard/getInviteLetterContent');
const saveInviteLetter = require('../routes/dashboard/saveInviteLetter');
const getCommunityInfo = require('../routes/dashboard/getCommunityInfo');
const getMembersOfGroup = require('../routes/dashboard/getMembersOfGroup');
const getMembersOfCommunity = require('../routes/dashboard/getMembersOfCommunity');
const saveInvoice = require('../routes/dashboard/saveInvoice');

// API for testing features -- remove from production version
const testprocget = require('../routes/tests/testprocget');

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  // helmet is a security blanket that stops providing server http info
  // to the browser. Commented in dev time. Uncomment before porting to prduction.
  // app.use(helmet());

  // Change logfile name with date every day later on.
  // May want to use Morgan only when we want to study delays etc. 
  // For performance, use it only in development for R&D
  // if (app.get("env") === "development") {
  //   app.use(
  //     morgan("common", {
  //       stream: fs.createWriteStream("./log/" + "access.log", { flags: "a" })
  //     })
  //   );
  //   startupDebugger('Morgan enabled');
  // }

  // Log any invocation to api upon entry into Baanda server that includes BaandaId.
  // app.use(entryLogger);

  app.use("/routes/users/register", register);
  app.use("/routes/users/login", login);
  app.use("/routes/users/verify", verify);
  app.use('/routes/users/dbtest', dbtest);
  app.use('/routes/users/getUserPersonaQ', getUserPersonaQ);

  app.use('/routes/users/postUserPersonaScore', postUserPersonaScore);
  app.use('/routes/shared/getPersonaScores', getPersonaScores);
  app.use('/routes/users/postUserProfile', postUserProfile);

  // API for Create  
  app.use('/routes/create/saveNewCommunity', saveNewCommunity);
  app.use('/routes/create/ifCommunityExists', ifCommunityExists);
  
  // API for Dashboard
  app.use('/routes/dashboard/getAccessList', getAccessList);
  app.use('/routes/dashboard/ifCatalogItemExists', ifCatalogItemExists);
  app.use('/routes/dashboard/saveCatalogItem', saveCatalogItem);
  app.use('/routes/dashboard/searchItemToEdit', searchItemToEdit);
  app.use('/routes/dashboard/getItemToEdit', getItemToEdit);
  app.use('/routes/dashboard/updateCatelogItem', updateCatalogItem);
  app.use('/routes/dashboard/updateInventory', updateInventory);
  app.use('/routes/dashboard/ifGroupExists', ifGroupExists);
  app.use('/routes/dashboard/createNewGroup', createNewGroup);
  app.use('/routes/dashboard/saveGetGroupMembers', saveGetGroupMembers);
  app.use('/routes/dashboard/getGroupsOfCommunity', getGroupsOfCommunity);
  app.use('/routes/dashboard/updateGroup', updateGroup);
  app.use('/routes/dashboard/deleteGroupMember', deleteGroupMember);
  app.use('/routes/dashboard/saveInvitesAndSendMails', saveInvitesAndSendMails);
  app.use('/routes/dashboard/groupInviteResponseApi', groupInviteResponseApi);
  app.use('/routes/dashboard/saveInvitesToIndvidual', saveInvitesToIndvidual);
  app.use('/routes/dashboard/getInviteLetterContent', getInviteLetterContent);
  app.use('/routes/dashboard/saveInviteLetter', saveInviteLetter);
  app.use('/routes/dashboard/getCommunityInfo', getCommunityInfo);
  app.use('/routes/dashboard/getMembersOfGroup', getMembersOfGroup);
  app.use('/routes/dashboard/getMembersOfCommunity', getMembersOfCommunity);
  app.use('/routes/dashboard/saveInvoice', saveInvoice);


  // API for testing features -- remove  from production
  app.use('/routes/tests/testprocget', testprocget);


  app.use(error);
  let logMsg = { type: "server", domain: "start", msg: "Routers initiated" };
  logger.info(JSON.stringify(logMsg));
};
