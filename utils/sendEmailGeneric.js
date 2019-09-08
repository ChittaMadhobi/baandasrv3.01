const nodemailer = require("nodemailer");
const keys = require("../config/keys");

const emailDebugger = require("debug")("app:email");

// const img = require('../images/ADN_animation.gif');

sendEmail = async emailReq => {
//   emailDebugger("sendEmailGeneric =======================>>");
  emailDebugger("emailReq:", emailReq);

  let email = emailReq.toEmail;

  let htmlbody = emailReq.body;

  let outcome = true;
  let message = "";

  // emailDebugger("htmlLink" + htmlLink + " toEMail:" + toEmail);
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: keys.emailID,
      pass: keys.emailPassKey
    }
  });

  let mailOptions = {
    from: keys.emailID,
    to: email,
    subject: emailReq.subject,
    text: "INVESTIGATE WHAT DOES THIS TEXT DO",
    html: htmlbody
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      emailDebugger("Error sendmail : " + error);
      message = error.message;
      outcome = false;
    } else {
      emailDebugger("Message %s sent: %s ", info.messageId, info.response);
      (message = "Message %s sent: %s "), info.messageId, info.response;
    }
  });

  let ret = { outcome: outcome, Msg: message };

  return ret;
};

module.exports = sendEmail;
