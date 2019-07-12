const apiLogDebugger = require("debug")("app:api");

entryLog = (req, res, next) => {
  // If req does not have BaandaId, do not log.
  apiLogDebugger(req.body);
  //   console.log(req.get('host'));
  apiLogDebugger(req.originalUrl);
  next();
};

module.exports = entryLog;
