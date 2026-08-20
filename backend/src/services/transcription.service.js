const fs = require("fs");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const transcribeAudio = async (filePath) => {
  if (!filePath) {
    throw new Error("Audio file path is required.");
  }

  if (!fs.existsSync(filePath)) {
    throw new Error("Audio file not found.");
  }

  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model:
      process.env.GROQ_TRANSCRIPTION_MODEL ||
      "whisper-large-v3-turbo",
    response_format: "json",
    temperature: 0,
  });

  return transcription.text;
};

module.exports = {
  transcribeAudio,
};