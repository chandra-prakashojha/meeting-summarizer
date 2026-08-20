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

module.exports = {
  createMeeting,
  findAllMeetings,
  findMeetingById,
  updateMeetingTranscript,
};