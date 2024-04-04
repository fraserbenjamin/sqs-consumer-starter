const express = require('express');
const app = express();
const port = 3010;
const path = require('path');
const { SQSClient } = require("@aws-sdk/client-sqs");
const { Consumer } = require('sqs-consumer');

const queueUrl = 'https://sqs.eu-central-1.amazonaws.com/111111111111/invalid-sqs-queue';

const sqsClient = new SQSClient({
  endpoint: queueUrl,
  region: "eu-central-1",
});

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('pages/index.html'));
});

app.get('/send', (req, res) => {
  const message = sqsClient.send();

  res.send(message);
});

app.listen(port, () => {
  console.log('SQS Client Created');

  const consumer = new Consumer({
    queueUrl,
    sqs: sqsClient,
    handleMessage: async (msg) => {
      console.log('Message:', msg.Body);
    },
  });

  console.log('SQS Consumer Created');

  consumer.on('error', (e) => {
    console.error(e);
  });
  consumer.on('message_processed', (e) => {
    console.log(e);
  });

  consumer.start();
  console.log('SQS Consumer Started');
});
