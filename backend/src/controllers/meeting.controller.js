const meetingService = require("../services/meeting.service");
const { deleteFile } = require("../utils/file.utils");

const createMeeting = async (req, res, next) => {
  try {
    const meetingData = {
      title: req.body.title,

      audio: {
        originalName: req.file.originalname,
        storagePath: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    };

    const meeting = await meetingService.createMeeting(meetingData);

    res.status(201).json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    if (req.file?.path) {
      await deleteFile(req.file.path);
    }

    next(error);
  }
};

const getAllMeetings = async (req, res, next) => {
  try {
    const meetings = await meetingService.getAllMeetings();

    res.status(200).json({
      success: true,
      data: meetings,
    });
  } catch (error) {
    next(error);
  }
};

const getMeetingById = async (req, res, next) => {
  try {
    const meeting = await meetingService.getMeetingById(req.params.id);

    res.status(200).json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMeeting = async (req, res, next) => {
  try {
    const meeting = await meetingService.deleteMeeting(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Delete the associated audio file
    if (meeting.audio?.storagePath) {
      await deleteFile(meeting.audio.storagePath);
    }

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  deleteMeeting,
};