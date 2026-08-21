import { useState } from "react";

import MeetingUpload from "./components/MeetingUpload";
import MeetingList from "./components/MeetingList";
import MeetingDetails from "./components/MeetingDetails";

function App() {
  const [selectedMeetingId, setSelectedMeetingId] =
    useState(null);

  if (selectedMeetingId) {
    return (
      <MeetingDetails
        meetingId={selectedMeetingId}
        onBack={() => setSelectedMeetingId(null)}
      />
    );
  }

  return (
    <div>
      <h1>Meeting Summarizer</h1>

      <p>
        Upload a meeting and get an AI-powered summary.
      </p>

      <MeetingUpload />

      <hr />

      <MeetingList
        onSelectMeeting={setSelectedMeetingId}
      />
    </div>
  );
}

export default App;