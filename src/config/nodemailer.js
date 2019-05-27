const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const Email = require('email-templates');
const transporter = nodemailer.createTransport(
  sgTransport({
    port: 465,
    auth: { api_key: process.env.SENDGRID_API_KEY }
  })
);

module.exports = new Email({
  transport: transporter,
  views: {
    options: {
      extension: 'ejs'
    }
  }
});
