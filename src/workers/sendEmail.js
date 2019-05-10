const path = require('path');
const email = require('../config/nodemailer');
const kue = require('kue');

const queue = kue.createQueue({
  prefix: 'notif',
  redis: {
    host: 'redis',
    port: 6379
  }
});

queue.setMaxListeners(100);

const sendMail = async (job, done) => {
  try {
    await email.send({
      message: {
        from: 'administration@schoolar.io',
        to: job.data.email,
        subject: 'Schoolar - Create a new password'
      },
      template: path.join(__dirname, '..', 'emails'),
      locals: {
        token: job.data.token,
        siteUrl: process.env.USER_UI_URL
      }
    });
    return done();
  } catch (e) {
    console.log(e);
    return done(new Error(JSON.stringify(e)));
  }
};

module.exports = () => {
  queue.process('notification.password.create', 5, async (job, done) => {
    await sendMail(job, done);
  });
};
