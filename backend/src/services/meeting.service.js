const meetingRepository = require("../repositories/meeting.repository");
const transcriptionQueue = require("../queues/transcription.queue");

const createMeeting = async (meetingData) => {
  // 1. Create meeting record
  const meeting = await meetingRepository.createMeeting(meetingData);

  // 2. Add transcription job
  await transcriptionQueue.add("transcribe-meeting", {
    meetingId: meeting._id.toString(),
    audioPath: meeting.audio.storagePath,
  });

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

const deleteMeeting = async (meetingId) => {
  const meeting = await meetingRepository.deleteMeeting(meetingId);

  return meeting;
};

module.exports = {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  deleteMeeting,
};