
import { useEffect, useState } from "react";
import axios from "axios";

const MeetingDetails = ({ meetingId, onBack }) => {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMeeting = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/meetings/${meetingId}`
      );

      setMeeting(response.data.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load meeting.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeeting();
  }, [meetingId]);

  if (loading) {
    return <p>Loading meeting...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!meeting) {
    return <p>Meeting not found.</p>;
  }

  return (
    <div>
      <button onClick={onBack}>← Back to Meetings</button>

      <h2>{meeting.title}</h2>

      <p>
        Status: <strong>{meeting.status}</strong>
      </p>

      {meeting.error?.message && (
        <p>
          Error: {meeting.error.message}
        </p>
      )}

      <hr />

      <h3>Transcript</h3>
      <p>
        {meeting.transcript || "Transcript is not available yet."}
      </p>

      <h3>Summary</h3>
      <p>
        {meeting.summary || "Summary is not available yet."}
      </p>

      <h3>Key Topics</h3>

      {meeting.keyTopics?.length > 0 ? (
        <ul>
          {meeting.keyTopics.map((topic, index) => (
            <li key={index}>{topic}</li>
          ))}
        </ul>
      ) : (
        <p>No key topics yet.</p>
      )}

      <h3>Key Decisions</h3>

      {meeting.keyDecisions?.length > 0 ? (
        <ul>
          {meeting.keyDecisions.map((decision, index) => (
            <li key={index}>{decision}</li>
          ))}
        </ul>
      ) : (
        <p>No key decisions yet.</p>
      )}

      <h3>Action Items</h3>

      {meeting.actionItems?.length > 0 ? (
        <ul>
          {meeting.actionItems.map((item, index) => (
            <li key={index}>
              <strong>{item.task}</strong>
              <br />
              Assignee: {item.assignee || "Not specified"}
              <br />
              Deadline: {item.deadline || "Not specified"}
              <br />
              Priority: {item.priority}
            </li>
          ))}
        </ul>
      ) : (
        <p>No action items yet.</p>
      )}
    </div>
  );
};

export default MeetingDetails;