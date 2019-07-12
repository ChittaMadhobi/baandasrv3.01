const mongoose = require("mongoose");
// Load Keys
const keys = require("../config/keys");
const db = keys.mongoURI;

module.exports = function() {
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log(`Logged into MLab URI = ${db}`)
    })
    .catch(err => console.log("Error Mongo : " + err));
};
