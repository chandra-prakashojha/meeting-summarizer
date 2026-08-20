require("dotenv").config();

const transcriptionQueue = require("./src/queues/transcription.queue");

const addTestJob = async () => {
  try {
    const job = await transcriptionQueue.add("transcribe-test", {
      meetingId: "test-meeting-001",
      audioPath:
        "./uploads/meetings/9d57988f-370d-432b-b4e6-6f5f2be593f5.m4a",
    });

    console.log(`Test job added: ${job.id}`);
  } catch (error) {
    console.error("Failed to add test job:", error);
  } finally {
    await transcriptionQueue.close();
  }
};

addTestJob();
