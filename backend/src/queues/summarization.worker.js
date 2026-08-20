
require("dotenv").config();

const { Worker } = require("bullmq");

const redisConnection = require("../config/redis");

const {
  summarizeTranscript,
} = require("../services/summarization.service");

const {
  findMeetingById,
  updateMeetingAnalysis,
} = require("../repositories/meeting.repository");

const startWorker = async () => {
  const summarizationWorker = new Worker(
    "summarization",
    async (job) => {
      console.log(`Processing summarization job: ${job.id}`);

      const { meetingId } = job.data;

      if (!meetingId) {
        throw new Error("Meeting ID is required.");
      }

      // Get the meeting from MongoDB
      const meeting = await findMeetingById(meetingId);

      if (!meeting) {
        throw new Error(`Meeting not found: ${meetingId}`);
      }

      if (!meeting.transcript) {
        throw new Error(
          `Transcript not available for meeting: ${meetingId}`
        );
      }

      // Generate structured analysis
      const analysis = await summarizeTranscript(
        meeting.transcript
      );

      console.log(
        `Summarization completed for meeting: ${meetingId}`
      );

      // Save analysis to MongoDB
      const updatedMeeting =
        await updateMeetingAnalysis(
          meetingId,
          analysis
        );

      if (!updatedMeeting) {
        throw new Error(
          `Failed to update meeting: ${meetingId}`
        );
      }

      console.log(
        `Analysis saved for meeting: ${meetingId}`
      );

      return {
        meetingId,
        analysis,
      };
    },
    {
      connection: redisConnection,
    }
  );

  summarizationWorker.on("completed", (job) => {
    console.log(
      `Summarization job ${job.id} completed successfully`
    );
  });

  summarizationWorker.on("failed", (job, error) => {
    console.error(
      `Summarization job ${job?.id} failed:`,
      error.message
    );
  });

  console.log("Summarization worker started");
};

startWorker().catch((error) => {
  console.error(
    "Failed to start summarization worker:",
    error
  );

  process.exit(1);
});