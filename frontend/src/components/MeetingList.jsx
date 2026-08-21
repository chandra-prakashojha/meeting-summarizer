import { useEffect, useState } from "react";
import axios from "axios";

const MeetingList = ({ onSelectMeeting }) => {
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
  }, []);

  if (loading) {
    return <p>Loading meetings...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Meetings</h2>

      {meetings.length === 0 ? (
        <p>No meetings found.</p>
      ) : (
        meetings.map((meeting) => (
          <div key={meeting._id}>
            <h3>{meeting.title}</h3>

            <p>
              Status: <strong>{meeting.status}</strong>
            </p>

            <p>
              Created:{" "}
              {new Date(meeting.createdAt).toLocaleString()}
            </p>

            <button
              onClick={() => onSelectMeeting(meeting._id)}
            >
              View Meeting
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MeetingList;