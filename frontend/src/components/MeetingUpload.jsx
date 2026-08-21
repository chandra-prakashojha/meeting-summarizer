
import { useState } from "react";
import axios from "axios";

const MeetingUpload = () => {
  const [title, setTitle] = useState("");
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("Please enter a meeting title.");
      return;
    }

    if (!audio) {
      setMessage("Please select an audio file.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("audio", audio);

  const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/v1/meetings`,
  formData
);
      console.log(response.data);

      setMessage("Meeting uploaded successfully!");
      setTitle("");
      setAudio(null);

      event.target.reset();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to upload meeting."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Meeting</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Meeting Title</label>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Enter meeting title"
          />
        </div>

        <div>
          <label>Audio File</label>

          <input
            type="file"
            accept="audio/*"
            onChange={(event) =>
              setAudio(event.target.files[0])
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Meeting"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default MeetingUpload;