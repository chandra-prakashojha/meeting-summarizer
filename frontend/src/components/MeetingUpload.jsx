import { useState } from "react";
import axios from "axios";

const MeetingUpload = ({ onUploadSuccess }) => {
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
      onUploadSuccess();
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
    <section className="upload-section">
      <h2>Upload Meeting</h2>

      <p className="upload-description">
        Upload a meeting recording and let AI generate
        the transcript, summary, topics, and action items.
      </p>

      <form
        className="upload-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label htmlFor="meeting-title">
            Meeting Title
          </label>

          <input
            id="meeting-title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="e.g. Sprint Planning"
          />
        </div>

        <div className="form-group">
          <label htmlFor="meeting-audio">
            Audio File
          </label>

          <input
            id="meeting-audio"
            type="file"
            accept="audio/*"
            onChange={(event) =>
              setAudio(event.target.files[0])
            }
          />
        </div>

        <button
          className="upload-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Meeting"}
        </button>

        {message && (
          <p
            className={
              message.includes("successfully")
                ? "success-message"
                : "error-text"
            }
          >
            {message}
          </p>
        )}
      </form>
    </section>
  );
};

export default MeetingUpload;