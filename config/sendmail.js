const nodemailer = require("nodemailer");
require('dotenv/config');

module.exports= async function (emailid, subject, msgbody){

//send email
let transporter = nodemailer.createTransport({
    host: process.env.SMTPHOST,
    port: process.env.PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAILUSER, // generated ethereal user
      pass: process.env.EMAILPASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: 'admin@gitanjali.org', // sender address
    to: emailid, // list of receivers
    subject: subject, // Subject line
    text: msgbody, // plain text body
    //html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}