import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import MeetingCard from "./MeetingCard";

const MeetingList = ({ onSelectMeeting, refreshKey }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      const matchesSearch = meeting.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        meeting.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [meetings, search, statusFilter]);

  if (loading) {
    return (
      <p className="loading-text">
        Loading meetings...
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

  return (
    <section className="meetings-section">
      <div className="section-header">
        <div>
          <h2>Your Meetings</h2>

          <p>
            View and manage your recorded meetings.
          </p>
        </div>

        <span className="meeting-count">
          {filteredMeetings.length} of {meetings.length} meetings
        </span>
      </div>

      <div className="meeting-filters">
        <div className="search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search meetings..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="ALL">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="UPLOADED">Uploaded</option>
          <option value="TRANSCRIBING">
            Transcribing
          </option>
          <option value="TRANSCRIBED">
            Transcribed
          </option>
          <option value="ANALYZING">Analyzing</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {filteredMeetings.length === 0 ? (
        <div className="empty-state">
          <h3>No meetings found</h3>

          <p>
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        <div className="meetings-grid">
          {filteredMeetings.map((meeting) => (
            <MeetingCard
  key={meeting._id}
  meeting={meeting}
  onSelectMeeting={onSelectMeeting}
  onDelete={fetchMeetings}
/>
          ))}
        </div>
      )}
    </section>
  );
};

export default MeetingList;