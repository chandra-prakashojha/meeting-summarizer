const mongoose = require("mongoose");

const actionItemSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
      trim: true,
    },

    assignee: {
      type: String,
      default: null,
      trim: true,
    },

    deadline: {
      type: String,
      default: null,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
  },
  { _id: false }
);

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    audio: {
      originalName: {
        type: String,
        required: true,
        trim: true,
      },

      storagePath: {
        type: String,
        required: true,
        trim: true,
      },

      mimeType: {
        type: String,
        required: true,
        trim: true,
      },

      size: {
        type: Number,
        required: true,
        min: 1,
      },
    },

    status: {
      type: String,
      enum: [
        "UPLOADED",
        "TRANSCRIBING",
        "TRANSCRIBED",
        "ANALYZING",
        "COMPLETED",
        "FAILED",
      ],
      default: "UPLOADED",
    },

    transcript: {
      type: String,
      default: null,
    },

    summary: {
      type: String,
      default: null,
    },

    keyDecisions: {
      type: [String],
      default: [],
    },

    keyTopics: {
      type: [String],
      default: [],
    },

    actionItems: {
      type: [actionItemSchema],
      default: [],
    },

    error: {
      code: {
        type: String,
        default: null,
      },

      message: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;