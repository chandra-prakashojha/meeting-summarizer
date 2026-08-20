require("dotenv").config();

const { Queue } = require("bullmq");

const q = new Queue("transcription", {
  connection: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  },
});

(async () => {
  try {
    const job = await q.getJob("2");

    if (!job) {
      console.log("Job 2 not found");
      return;
    }

    console.log({
      id: job.id,
      state: await job.getState(),
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
    });
  } catch (error) {
    console.error(error);
  } finally {
    await q.close();
  }
})();
