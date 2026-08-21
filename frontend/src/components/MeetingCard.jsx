import axios from "axios";
import StatusBadge from "./StatusBadge";

const MeetingCard = ({ meeting, onSelectMeeting, onDelete }) => {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${meeting.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/meetings/${meeting._id}`
      );

      onDelete();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete meeting."
      );
    }
  };

  return (
    <div className="meeting-card">
      <div className="meeting-card-header">
        <h3>{meeting.title}</h3>

        <StatusBadge status={meeting.status} />
      </div>

      <p className="meeting-date">
        {new Date(meeting.createdAt).toLocaleString()}
      </p>

      {meeting.summary && (
        <p className="meeting-summary">
          {meeting.summary}
        </p>
      )}

      <div className="meeting-actions">
        <button
          className="view-button"
          onClick={() => onSelectMeeting(meeting._id)}
        >
          View Meeting →
        </button>

        <button
          className="delete-button"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MeetingCard;