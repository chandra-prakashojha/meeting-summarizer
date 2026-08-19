const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const meetingRoutes = require("./routes/meeting.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// Security middleware
app.use(helmet());

// Allow requests from frontend
app.use(cors());

// Log HTTP requests
app.use(morgan("dev"));

// Parse JSON request bodies
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Meeting Summarizer API is running",
  });
});

// API routes
app.use("/api/v1/meetings", meetingRoutes);

// Centralized error handler
app.use(errorHandler);

module.exports = app;