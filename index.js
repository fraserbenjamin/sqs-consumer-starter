const express = require('express');
const app = express();
const port = 3010;
const path = require('path');
const sqs = require('./sqs');
const initConsumer = require('./consumer');

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('pages/index.html'));
});

app.get('/send', (req, res) => {
  const message = sqs.send();

  res.send(message);
});

app.listen(port, () => {
  // Edit these options if you need to
  const options = {
    queueUrl:
      'https://sqs.eu-central-1.amazonaws.com/111111111111/sqs-events-queue',
    sqs,
    handleMessage: async (msg) => {
      debug('Handled a message...');
      debug(msg);
    },
  };

  const consumer = initConsumer(options);
  consumer.on('error', (e) => {
    console.error(e);
  });
  consumer.on('message_processed', (e) => {
    console.log(e);
  });

  // Add your use case below, the rest of the setup has already been sorted out for you above.
  consumer.start();
});
