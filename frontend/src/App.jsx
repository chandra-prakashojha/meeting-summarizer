import { useState } from "react";

import MeetingUpload from "./components/MeetingUpload";
import MeetingList from "./components/MeetingList";
import MeetingDetails from "./components/MeetingDetails";

import "./App.css";

function App() {
  const [selectedMeetingId, setSelectedMeetingId] =
    useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  if (selectedMeetingId) {
    return (
      <div className="app">
        <div className="container">
          <MeetingDetails
            meetingId={selectedMeetingId}
            onBack={() => setSelectedMeetingId(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container header-content">
          <div className="logo">
            Meeting<span>Summarizer</span>
          </div>
        </div>
      </header>

      <main className="container">
        <MeetingUpload
          onUploadSuccess={() =>
            setRefreshKey((value) => value + 1)
          }
        />

        <MeetingList
          onSelectMeeting={setSelectedMeetingId}
          refreshKey={refreshKey}
        />
      </main>
    </div>
  );
}

export default App;