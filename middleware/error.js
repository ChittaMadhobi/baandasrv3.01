// const winston = require('winston');
const logger = require('../utils/loggerSetup');

module.exports = function (err, req, res, next) {
    // winston.error('This is winston error xxx', 'some error');
    let logMsg = { type: "server", domain: "startup", msg: err.message };
    logger.error(JSON.stringify(logMsg));
}