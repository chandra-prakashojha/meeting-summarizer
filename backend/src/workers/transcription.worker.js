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

 
const updateFailureWithRetry = async (
  meetingId,
  errorCode,
  errorMessage,
  maxRetries = 3
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await updateMeetingFailure(
        meetingId,
        errorCode,
        errorMessage
      );

      console.log(
        `Meeting ${meetingId} marked as FAILED`
      );

      return;
    } catch (updateError) {
      console.error(
        `Failed to update meeting failure status (attempt ${attempt}/${maxRetries}):`,
        updateError.message
      );

      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 2000 * attempt)
        );
      }
    }
  }

  console.error(
    `CRITICAL: Could not mark meeting ${meetingId} as FAILED after ${maxRetries} attempts`
  );
};



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

      // 1. Mark meeting as transcribing
      await updateMeetingStatus(meetingId, "TRANSCRIBING");

      console.log(
        `Meeting ${meetingId} marked as TRANSCRIBING`
      );

      // 2. Transcribe audio
      const transcript = await transcribeAudio(audioPath);

      console.log(
        `Transcription completed for meeting: ${meetingId}`
      );

      // 3. Save transcript
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

      // 4. Add summarization job
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

    await updateFailureWithRetry(
      meetingId,
      "TRANSCRIPTION_FAILED",
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