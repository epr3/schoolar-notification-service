const dotenv = require('dotenv');
dotenv.config();

const Redis = require('ioredis');
const kue = require('kue');

const queue = kue.createQueue({
  prefix: 'notif',
  redis: {
    host: 'redis',
    port: 6379
  }
});
queue.setMaxListeners(100);
const redis = new Redis(6379, 'redis');

const sendEmailWorker = require('./workers/sendEmail');
sendEmailWorker();
console.log('workers booted');

redis.on('pmessage', (pattern, channel, message) => {
  console.log(
    `Received the following message from ${channel}: ${message} on ${pattern}`
  );
  switch (channel) {
    case 'notification.password.create':
      queue
        .create(channel, { ...JSON.parse(message) })
        .removeOnComplete(true)
        .attempts(5)
        .backoff({ delay: 60 * 1000, type: 'exponential' })
        .save();
      break;
  }
});

redis.psubscribe('notification.*');
console.log('Dispatcher is on!');
