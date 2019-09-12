/*
** Description: The root of Baanda backend server - server landing 
** Rivision Log:
** Author               Date        Description
** -----------------    ----------- -------------------------------------------------
** Jit (Sarbojit)       Jul 11, 19  Program initiated.
**
**
** Note for debugging: (if you are using Mac/Linux us export instead of set)
   set DEBUG=app:api      for middleware debug
   set DEBUG=app:db       for database related
   set DEBUG=app:startup  for startup related
   set DEBUG=app:email    for email or notification related issues
   set DEBUG=             to cancel console.log or dev-debug mode.
************************************************************************
*/
// const testmail = require("./utils/confirmEmail");
require('express-async-errors');
const express = require("express");
const logger = require('./utils/loggerSetup');
const cors = require('cors');
var path = require('path');

const app = express();

app.use(cors()); 
app.use(express.static(path.join(__dirname, '../')));

require("./startup/routes")(app);
require('./startup/dbConnection')();
let logMsg; // placeholder variable for logging


// This is used for testing when deployed (in cloud or anywhere)
app.get("/", (req, res) => {
  res.send("Hello Baanda 3 - http server testing");
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start the server - ready to listen.
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server BabiMaDidiMeGeno listening at port ${port}`);
  logMsg = { type: "server", domain: "startup", msg: `** Server BabiMaDidiMeGeno listening at port ${port}` };
  logger.info(JSON.stringify(logMsg));
});
