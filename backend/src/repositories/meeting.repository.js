const Meeting = require("../models/meeting.model");

const createMeeting = async (meetingData) => {
  const meeting = await Meeting.create(meetingData);

  return meeting;
};

const findAllMeetings = async () => {
  const meetings = await Meeting.find()
    .sort({ createdAt: -1 })
    .lean();

  return meetings;
};

const findMeetingById = async (meetingId) => {
  const meeting = await Meeting.findById(meetingId).lean();

  return meeting;
};

const deleteMeeting = async (meetingId) => {
  const meeting = await Meeting.findByIdAndDelete(meetingId);

  return meeting;
};


const updateMeetingTranscript = async (meetingId, transcript) => {
  const meeting = await Meeting.findByIdAndUpdate(
    meetingId,
    {
      $set: {
        transcript,
        status: "TRANSCRIBED",
        "error.code": null,
        "error.message": null,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  return meeting;
};

const updateMeetingAnalysis = async (meetingId, analysis) => {
  const meeting = await Meeting.findByIdAndUpdate(
    meetingId,
    {
      $set: {
        summary: analysis.summary,
        keyTopics: analysis.keyTopics,
        keyDecisions: analysis.keyDecisions,
        actionItems: analysis.actionItems,
        status: "COMPLETED",
        "error.code": null,
        "error.message": null,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  return meeting;
};

const updateMeetingFailure = async (
  meetingId,
  errorCode,
  errorMessage
) => {
  const meeting = await Meeting.findByIdAndUpdate(
    meetingId,
    {
      $set: {
        status: "FAILED",
        "error.code": errorCode,
        "error.message": errorMessage,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  return meeting;
};

const updateMeetingStatus = async (meetingId, status) => {
  const meeting = await Meeting.findByIdAndUpdate(
    meetingId,
    {
      $set: {
        status,
        "error.code": null,
        "error.message": null,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  return meeting;
};

module.exports = {
  createMeeting,
  findAllMeetings,
  findMeetingById,
  deleteMeeting,
  updateMeetingTranscript,
  updateMeetingAnalysis,
  updateMeetingFailure,
  updateMeetingStatus,
};