const nodemailer = require("nodemailer");
const keys = require("../config/keys");

const emailDebugger = require("debug")("app:email");

// const img = require('../images/ADN_animation.gif');

sendEmail = emailReq => {
  console.log("emailReq: ", emailReq);
  let email = emailReq.toEmail;
  // console.log("sendEmail ---------------------------------------");
  let link =
    keys.emailHost +
    "routes/dashboard/groupInviteResponseApi?fromEmail=" +
    email + "&communityId=" + emailReq.communityId +
    "&groupId=" + emailReq.groupId +
    "&response=" +
    "yes";
  // console.log("req.protocol link: ", link);


  let htmlLink =
    emailReq.salute +
    "&nbsp;<b>" +
    emailReq.toName +
    "</b>,<br /><br /><pre>" +
    emailReq.letterBody +
    "</pre><br />" +
    emailReq.linkDirection +
    "<br />" +
    '<a href="' +
    link +
    '">' +
    '&nbsp;&nbsp;&nbsp;&nbsp;<img src="cid:welcome" alt="baanda" height="200" width="300"/>' +
    "</a><br/><br /><pre>" +
    emailReq.signature +
    "</pre><br /><br /><font color='green' size='1'>Build Together, Band Together, Bond Together<br/>" +
    '<img src="cid:baandalogo" align="top" height="20" width="20"/>&nbsp;&nbsp;<b>Baanda.com</b>' +
    "&nbsp;&nbsp;<i>(Serving the Joy of Cooperation)</i></font>";

  let outcome = true;
  let message = '';

  // console.log("htmlLink" + htmlLink + " toEMail:" + toEmail);
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
    html: htmlLink,
    attachments: [
      {
        filename: "herbpic5.jpg",
        path: __dirname + "/herbpic5.jpg",
        cid: "welcome"
      },
      {
        filename: "baandalogo.png",
        path: __dirname + "/baandalogo.png",
        cid: "baandalogo"
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      emailDebugger("Error sendmail : " + error);
      message = error.message
      outcome = false;
    } else {
      emailDebugger("Message %s sent: %s ", info.messageId, info.response);
      message = "Message %s sent: %s ", info.messageId, info.response;
    }
  });

  let ret = { outcome: outcome, Msg: message}

  return ret;
};
 

module.exports = sendEmail;
