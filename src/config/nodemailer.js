const nodemailer = require('nodemailer');
const Email = require('email-templates');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS
  }
});

module.exports = new Email({
  transport: transporter,
  views: {
    options: {
      extension: 'ejs'
    }
  }
});
