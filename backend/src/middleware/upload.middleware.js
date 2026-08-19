const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDirectory = path.join(
  __dirname,
  "../../uploads/meetings"
);

fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedMimeTypes = new Set([
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/webm",
]);

const allowedExtensions = new Set([
  ".mp3",
  ".wav",
  ".m4a",
  ".webm",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${crypto.randomUUID()}${extension}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  console.log("Uploaded audio:", {
    originalName: file.originalname,
    mimeType: file.mimetype,
    extension,
  });

  const isMimeTypeAllowed =
    allowedMimeTypes.has(file.mimetype) ||
    file.mimetype === "application/octet-stream";

  const isExtensionAllowed = allowedExtensions.has(extension);

  if (!isMimeTypeAllowed || !isExtensionAllowed) {
    return cb(new Error("Only supported audio files are allowed."));
  }

  cb(null, true);
};

const uploadAudio = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 1,
  },
});

module.exports = uploadAudio;