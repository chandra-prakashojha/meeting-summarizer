require("dotenv").config();

const { Worker } = require("bullmq");

const redisConnection = require("../config/redis");
const connectDatabase = require("../config/database");

const {
  transcribeAudio,
} = require("../services/transcription.service");


const {
  updateMeetingTranscript,
  updateMeetingFailure,
  updateMeetingStatus,
} = require("../repositories/meeting.repository");

const summarizationQueue = require("../queues/summarization.queue");

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

      // 1. Transcribe audio
      const transcript = await transcribeAudio(audioPath);

      console.log(
        `Transcription completed for meeting: ${meetingId}`
      );

      // 2. Save transcript
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

      // 3. Add summarization job
      const summarizationJob =
        await summarizationQueue.add(
          "summarize-meeting",
          {
            meetingId,
          }
        );

      console.log(
        `Summarization job ${summarizationJob.id} added for meeting: ${meetingId}`
      );

      return {
        meetingId,
        transcript,
        summarizationJobId: summarizationJob.id,
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

  transcriptionWorker.on("failed", async (job, error) => {
    console.error(
      `Job ${job?.id} failed:`,
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
        `Job ${job.id} will be retried. Attempt ${job.attemptsMade} of ${maxAttempts}`
      );

      return;
    }

    const { meetingId } = job.data;

    try {
      await updateMeetingFailure(
        meetingId,
        "TRANSCRIPTION_FAILED",
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

  console.log("Transcription worker started");
};

startWorker().catch((error) => {
  console.error(
    "Failed to start transcription worker:",
    error
  );

  process.exit(1);
});