const express = require("express");

const meetingController = require("../controllers/meeting.controller");
const validate = require("../middleware/validation.middleware");
const uploadAudio = require("../middleware/upload.middleware");
const {
  createMeetingSchema,
} = require("../validators/meeting.validator");

const router = express.Router();

router.post(
  "/",
  uploadAudio.single("audio"),
  validate(createMeetingSchema),
  meetingController.createMeeting
);

router.get("/", meetingController.getAllMeetings);

router.get("/:id", meetingController.getMeetingById);

module.exports = router;