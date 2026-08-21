import StatusBadge from "./StatusBadge";

const MeetingCard = ({ meeting, onSelectMeeting }) => {
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

      <button
        className="view-button"
        onClick={() => onSelectMeeting(meeting._id)}
      >
        View Meeting →
      </button>
    </div>
  );
};

export default MeetingCard;