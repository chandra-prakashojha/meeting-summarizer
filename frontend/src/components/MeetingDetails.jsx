import { useEffect, useState } from "react";
import axios from "axios";
import StatusBadge from "./StatusBadge";

const MeetingDetails = ({ meetingId, onBack }) => {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let intervalId;

    const processingStatuses = [
      "UPLOADED",
      "TRANSCRIBING",
      "TRANSCRIBED",
      "ANALYZING",
    ];

    const loadMeeting = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/meetings/${meetingId}`
        );

        const meetingData = response.data.data;

        setMeeting(meetingData);
        setLoading(false);

        if (processingStatuses.includes(meetingData.status)) {
          intervalId = setInterval(async () => {
            try {
              const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/meetings/${meetingId}`
              );

              const updatedMeeting = response.data.data;

              setMeeting(updatedMeeting);

              if (
                !processingStatuses.includes(
                  updatedMeeting.status
                )
              ) {
                clearInterval(intervalId);
              }
            } catch (error) {
              console.error(error);
            }
          }, 3000);
        }
      } catch (error) {
        console.error(error);

        setError("Failed to load meeting.");
        setLoading(false);
      }
    };

    loadMeeting();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [meetingId]);

  if (loading) {
    return (
      <p className="loading-text">
        Loading meeting...
      </p>
    );
  }

  if (error) {
    return (
      <p className="error-text">
        {error}
      </p>
    );
  }

  if (!meeting) {
    return (
      <p className="error-text">
        Meeting not found.
      </p>
    );
  }

  return (
    <section className="details-page">
      <button className="back-button" onClick={onBack}>
        ← Back to Meetings
      </button>

      <div className="details-header">
        <div>
          <h1>{meeting.title}</h1>

          <p className="details-date">
            Created{" "}
            {new Date(meeting.createdAt).toLocaleString()}
          </p>
        </div>

        <StatusBadge status={meeting.status} />
      </div>

      {meeting.status !== "COMPLETED" && (
        <div className="processing-card">
          <h3>Meeting is being processed</h3>

          <p>
            {meeting.status === "UPLOADED" &&
              "Your audio has been uploaded and is waiting for transcription."}

            {meeting.status === "TRANSCRIBING" &&
              "Your audio is currently being transcribed."}

            {meeting.status === "TRANSCRIBED" &&
              "Transcription is complete. AI analysis will start shortly."}

            {meeting.status === "ANALYZING" &&
              "AI is analyzing the transcript and generating your meeting summary."}

            {meeting.status === "FAILED" &&
              "Something went wrong while processing this meeting."}
          </p>

          {meeting.error?.message && (
            <p className="error-text">
              {meeting.error.message}
            </p>
          )}
        </div>
      )}

      {meeting.summary && (
        <div className="summary-card">
          <h2>Summary</h2>

          <p>{meeting.summary}</p>
        </div>
      )}

      <div className="details-grid">
        <div className="info-card">
          <h2>Key Topics</h2>

          {meeting.keyTopics?.length > 0 ? (
            <ul className="topic-list">
              {meeting.keyTopics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          ) : (
            <p className="muted-text">
              No key topics yet.
            </p>
          )}
        </div>

        <div className="info-card">
          <h2>Key Decisions</h2>

          {meeting.keyDecisions?.length > 0 ? (
            <ul className="topic-list">
              {meeting.keyDecisions.map(
                (decision, index) => (
                  <li key={index}>{decision}</li>
                )
              )}
            </ul>
          ) : (
            <p className="muted-text">
              No key decisions yet.
            </p>
          )}
        </div>
      </div>

      <div className="info-card">
        <h2>Action Items</h2>

        {meeting.actionItems?.length > 0 ? (
          <div className="action-list">
            {meeting.actionItems.map((item, index) => (
              <div className="action-item" key={index}>
                <div>
                  <h3>{item.task}</h3>

                  <p>
                    Assignee:{" "}
                    {item.assignee || "Not specified"}
                  </p>

                  <p>
                    Deadline:{" "}
                    {item.deadline || "Not specified"}
                  </p>
                </div>

                <span
                  className={`priority priority-${item.priority.toLowerCase()}`}
                >
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted-text">
            No action items yet.
          </p>
        )}
      </div>

      <div className="info-card transcript-card">
        <h2>Transcript</h2>

        {meeting.transcript ? (
          <p className="transcript-text">
            {meeting.transcript}
          </p>
        ) : (
          <p className="muted-text">
            Transcript is not available yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default MeetingDetails;