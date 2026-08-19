const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Multer-specific errors
  if (err instanceof multer.MulterError) {
    let statusCode = 400;
    let code = "UPLOAD_ERROR";
    let message = err.message;

    if (err.code === "LIMIT_FILE_SIZE") {
      statusCode = 413;
      code = "FILE_TOO_LARGE";
      message = "Audio file exceeds the maximum allowed size of 25 MB.";
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      code = "TOO_MANY_FILES";
      message = "Only one audio file is allowed.";
    }

    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
      },
    });
  }

  // Invalid audio type from our fileFilter
  if (err.message === "Only supported audio files are allowed.") {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_AUDIO_TYPE",
        message: err.message,
      },
    });
  }

  // JSON parsing errors
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_JSON",
        message: "Request contains invalid JSON.",
      },
    });
  }

  const statusCode = err.statusCode || err.status || 500;

  return res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message:
        statusCode >= 500
          ? "Something went wrong."
          : err.message || "Request failed.",
    },
  });
};

module.exports = errorHandler;