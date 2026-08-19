const meetingRepository = require("../repositories/meeting.repository");

const createMeeting = async (meetingData) => {
  const meeting = await meetingRepository.createMeeting(meetingData);

  return meeting;
};

const getAllMeetings = async () => {
  const meetings = await meetingRepository.findAllMeetings();

  return meetings;
};

const getMeetingById = async (meetingId) => {
  const meeting = await meetingRepository.findMeetingById(meetingId);

  return meeting;
};

module.exports = {
  createMeeting,
  getAllMeetings,
  getMeetingById,
};