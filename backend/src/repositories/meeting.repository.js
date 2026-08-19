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

module.exports = {
  createMeeting,
  findAllMeetings,
  findMeetingById,
};