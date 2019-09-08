const mongoose = require("mongoose");
// Load Keys
const keys = require("../config/keys");
const db = keys.mongoURI;
// const db = keys.mongoAtlasURI;

module.exports = async function(next) {
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log(`Logged into MLab URI = ${db}`)
    })
    .catch(err => {
      console.log("Error Mongo : " + err);
      return(1); // exit the system
  });
};
