require("dotenv").config();

const { Worker } = require("bullmq");

const redisConnection = require("../config/redis");
const connectDatabase = require("../config/database");

const {
  transcribeAudio,
} = require("../services/transcription.service");

const {
  updateMeetingTranscript,
} = require("../repositories/meeting.repository");

const startWorker = async () => {
  await connectDatabase();

  const transcriptionWorker = new Worker(
    "transcription",
    async (job) => {
      console.log(`Processing transcription job: ${job.id}`);

      const { meetingId, audioPath } = job.data;

      if (!meetingId || !audioPath) {
        throw new Error(
          "Meeting ID and audio path are required."
        );
      }

      const transcript = await transcribeAudio(audioPath);

      console.log(
        `Transcription completed for meeting: ${meetingId}`
      );

      const updatedMeeting =
        await updateMeetingTranscript(
          meetingId,
          transcript
        );

      if (!updatedMeeting) {
        throw new Error(
          `Meeting not found: ${meetingId}`
        );
      }

      console.log(
        `Transcript saved for meeting: ${meetingId}`
      );

      return {
        meetingId,
        transcript,
      };
    },
    {
      connection: redisConnection,
    }
  );

  transcriptionWorker.on("completed", (job) => {
    console.log(
      `Job ${job.id} completed successfully`
    );
  });

  transcriptionWorker.on("failed", (job, error) => {
    console.error(
      `Job ${job?.id} failed:`,
      error.message
    );
  });

  console.log("Transcription worker started");
};

startWorker().catch((error) => {
  console.error(
    "Failed to start transcription worker:",
    error
  );

  process.exit(1);
});