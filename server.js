/*
** Description: The root of Baanda backend server - server landing 
** Rivision Log:
** Author               Date        Description
** -----------------    ----------- -------------------------------------------------
** Jit (Sarbojit)       Jul 11, 19  Program initiated.
**
**
** Note for debugging: (if you are using Mac/Linux us export instead of set)
   set DEBUG='app:api'      for middleware debug
   set DEBUG='app:db'       for database related
   set DEBUG='app:startup'  for startup related
   set DEBUG='app:email'    for email or notification related issues
   set DEBUG=               to cancel console.log or dev-debug mode.
************************************************************************
*/
const testmail = require('./utils/confirmEmail');

const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/dbConnection')();

// delte this at the end 
app.get('/', (req, res) => { 
    res.send('Hello Baanda 3');
});

app.post('/testmail', (req, res) => {
    let ret = testmail(req, res, 1234);
    res.status(200).send('Outcome of send mail:'+ ret);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server BabiMaDidiMeGeno listening at port ${port}`);
})