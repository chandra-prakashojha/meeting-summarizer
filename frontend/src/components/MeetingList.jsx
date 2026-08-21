import { useEffect, useState } from "react";
import axios from "axios";
import MeetingCard from "./MeetingCard";

const MeetingList = ({ onSelectMeeting, refreshKey }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/meetings`
      );

      setMeetings(response.data.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load meetings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchMeetings();
}, [refreshKey]);

  if (loading) {
    return <p className="loading-text">Loading meetings...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <section className="meetings-section">
      <div className="section-header">
        <div>
          <h2>Your Meetings</h2>
          <p>View and manage your recorded meetings.</p>
        </div>

        <span className="meeting-count">
          {meetings.length} meetings
        </span>
      </div>

      {meetings.length === 0 ? (
        <div className="empty-state">
          <h3>No meetings yet</h3>
          <p>
            Upload your first meeting to get started.
          </p>
        </div>
      ) : (
        <div className="meetings-grid">
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting._id}
              meeting={meeting}
              onSelectMeeting={onSelectMeeting}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MeetingList;