
const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const transcriptionQueue = new Queue("transcription", {
  connection: redisConnection,
});

module.exports = transcriptionQueue;