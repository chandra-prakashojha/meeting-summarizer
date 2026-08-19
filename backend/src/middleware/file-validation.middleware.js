const validateAudioFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: {
        code: "AUDIO_FILE_REQUIRED",
        message: "An audio file is required.",
      },
    });
  }

  next();
};

module.exports = validateAudioFile;