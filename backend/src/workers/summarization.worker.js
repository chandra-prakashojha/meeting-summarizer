require("dotenv").config();

const { Worker } = require("bullmq");

const redisConnection = require("../config/redis");
const connectDatabase = require("../config/database");

const {
  summarizeTranscript,
} = require("../services/summarization.service");


const {
  findMeetingById,
  updateMeetingAnalysis,
  updateMeetingFailure,
  updateMeetingStatus,
} = require("../repositories/meeting.repository");


const startWorker = async () => {
  await connectDatabase();

  const summarizationWorker = new Worker(
    "summarization",
    async (job) => {
      console.log(
        `Processing summarization job: ${job.id}`
      );

      const { meetingId } = job.data;

      if (!meetingId) {
        throw new Error("Meeting ID is required.");
      }

      // 1. Get meeting from MongoDB
      const meeting = await findMeetingById(meetingId);

      if (!meeting) {
        throw new Error(
          `Meeting not found: ${meetingId}`
        );
      }

      if (!meeting.transcript) {
        throw new Error(
          `Transcript not available for meeting: ${meetingId}`
        );
      }



await updateMeetingStatus(
  meetingId,
  "ANALYZING"
);

console.log(
  `Meeting ${meetingId} status: ANALYZING`
);


      // 2. Generate summary and analysis
      const analysis = await summarizeTranscript(
        meeting.transcript
      );

      console.log(
        `Summarization completed for meeting: ${meetingId}`
      );

      // 3. Save analysis to MongoDB
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

  summarizationWorker.on("failed", async (job, error) => {
    console.error(
      `Summarization job ${job?.id} failed:`,
      error.message
    );

    if (!job) {
      return;
    }

    const maxAttempts = job.opts.attempts || 1;

    const isFinalAttempt =
      job.attemptsMade >= maxAttempts;

    if (!isFinalAttempt) {
      console.log(
        `Summarization job ${job.id} will be retried. Attempt ${job.attemptsMade} of ${maxAttempts}`
      );

      return;
    }

    const { meetingId } = job.data;

    try {
      await updateMeetingFailure(
        meetingId,
        "SUMMARIZATION_FAILED",
        error.message
      );

      console.log(
        `Meeting ${meetingId} marked as FAILED`
      );
    } catch (updateError) {
      console.error(
        `Failed to update meeting failure status:`,
        updateError.message
      );
    }
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