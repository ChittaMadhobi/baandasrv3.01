const nodemailer = require('nodemailer');
const keys = require('../config/keys');

const emailDebugger = require('debug')('app:email');

// const img = require('../images/ADN_animation.gif');

confirmMail = (req, confirmCode) => {

    let toEmail = req.body.email;
    // console.log('confirm email:' , req.body);
    // let link = req.protocol + '://' + req.get('host') + 
    //            '/routes/users/verify?id=' +
    //             confirmCode + '&email=' + toEmail;
    let link = req.protocol + '://' + keys.emailHost + 
               '/routes/users/verify?id=' +
                confirmCode + '&email=' + toEmail;

    let htmlLink =
            'Hello ' + req.body.name + ",<br/><br/>" + 
            'Welcome to <b>Baanda!</b><br/><br />' +
            'Thanks for registering. Please click the photo to confirm <br/><br/>' + 
            '<a href="' + link + '">' +
            '&nbsp;&nbsp;&nbsp;&nbsp;<img src="cid:welcome" alt="baanda" height="200" width="300"/>' +
            '</a><br/>' +  
            'Baanda is where we create community - Build Together, Band Together, Bond Together<br/><br/>' +
            'Regards<br/><br/>' +
            '<p><img src="cid:baandalogo" align="top" height="20" width="20"/>&nbsp;&nbsp;<font color="green"><b>Baanda</b></font></p>' +
            '<i>Cooperation is the essence of Life.</i>'        
            
    var outcome = true;

    emailDebugger('htmlLink' + htmlLink + ' toEMail:' + toEmail);   
    var transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
          user: keys.emailID,
          pass: keys.emailPassKey
        }
      });
    
    //   html: '<b>Hello</b><br/> <img src="cid:welcome" />',
      var mailOptions = {
        from: keys.emailID,
        to: toEmail,
        subject: 'Baanda Email Verification & Welcome',
        text: 'Welcome to Baanda!!',
        html: htmlLink,
        attachments: [
            {
                filename: 'dna.jpg',
                path: __dirname + '/dna.jpg',
                cid: "welcome"
            },
            {
              filename: 'logotr-46x46.png',
              path: __dirname + '/logotr-46x46.png',
              cid: "baandalogo"
          }
        ]
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            emailDebugger('Error sendmail : ' + error);
          outcome = false;
        } else {
            emailDebugger('Message %s sent: %s ', info.messageId, info.response);
        }
      });
    
      return outcome;  
};

module.exports = confirmMail;