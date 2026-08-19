const fs = require("fs/promises");

const deleteFile = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    // File may already be deleted or may not exist.
    if (error.code !== "ENOENT") {
      console.error("Failed to delete file:", error.message);
    }
  }
};

module.exports = {
  deleteFile,
};