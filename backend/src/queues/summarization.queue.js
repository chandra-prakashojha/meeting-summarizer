const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const summarizationQueue = new Queue("summarization", {
  connection: redisConnection,
});

module.exports = summarizationQueue;