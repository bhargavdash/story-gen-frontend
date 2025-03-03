import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// Component to display generated audio files
const languages = {
    "en": "English",
    "hi": "Hindi",
    "es": "Spanish",
    "de": "German",
    "ja": "Japanese"
}
const AudioPlayer = ({ audioUrls }) => {
  return (
    <div className="mt-8 p-6 rounded-lg bg-gray-800 shadow-md">
      <h2 className="text-2xl font-semibold text-teal-300 mb-4">
        Generated Audio:
      </h2>
      <ul>
        {Object.entries(audioUrls).map(([lang, url]) => (
          <li key={lang} className="mb-6">
            <h3 className="text-xl font-medium text-teal-200">
              {languages[lang]}
            </h3>
            <audio controls className="mt-2 w-full">
              <source src={url} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <br />
            <a href={url} download={`${lang}_audio.wav`}>
              <button className="mt-3 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-150">
                Download
              </button>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

function UploadSection() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [genre, setGenre] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrls, setAudioUrls] = useState({});
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Generate image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleGenerateStory = async () => {
    if (selectedFiles.length === 0 || genre === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please upload atleast one image and select a genre.."
      })
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("genre", genre);

    try {
      setLoading(true);
      setStory("");
      setAudioUrls({}); // Reset audio when generating a new story

      const response = await axios.post(
        "https://story-from-images-610021435606.us-central1.run.app/generate_story/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Received story from backend", response);
      setStory(response.data);
    } catch (error) {
      console.error("Error generating story:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to generate story. Please try again.."
      })
      
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!story) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Story is not available.."
      })
      return;
    }

    const formData = new FormData();
    formData.append("story", story);
    formData.append("genre", genre);
    formData.append("upload_time", new Date().toISOString());

    try {
      setLoading(true);
      setAudioUrls({}); // Reset audio when generating new one

      const response = await axios.post("https://story-from-images-610021435606.us-central1.run.app/generate_audio/", formData);
      console.log("Received audio from backend", response);
      setAudioUrls(response.data);
    } catch (error) {
      console.error("Error generating audio:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to generate audio. Please try again.."
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-gray-800 to-gray-700 text-white">
      <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-xl border-t-4 border-teal-500">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Upload Images & Select Genre
        </h2>

        {/* File Upload Box */}
        <div className="border-2 border-dashed border-teal-400 rounded-lg p-4 mb-6 text-center">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer text-teal-300 hover:text-teal-400 transition-colors"
          >
            Click to select images
          </label>
        </div>

        {/* Image Preview Grid */}
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {previewUrls.map((src, index) => (
              <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden shadow-md"
              >
              <img
                key={index}
                src={src}
                alt={`Preview ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              </div>
            ))}
          </div>
        )}

        {/* Genre Dropdown */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="block w-full mt-4 p-3 border rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">-- Select Genre --</option>
          <option value="horror">Horror</option>
          <option value="fantasy">Fantasy</option>
          <option value="romantic">Romantic</option>
          <option value="psycho_thriller">Psychological Thriller</option>
          <option value="crime_fiction">Crime Fiction</option>
        </select>

        {/* Generate Story Button */}
        <button
          onClick={handleGenerateStory}
          className="mt-6 w-full px-5 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition duration-150"
          disabled={loading}
        >
          {loading ? "Generating Story..." : "Generate Story"}
        </button>

        {/* Loading Spinner */}
        {loading && (
          <p className="text-center text-teal-200 mt-4">
            Please wait while we generate your story...
          </p>
        )}

        {/* Display Generated Story */}
        {story && (
          <div className="mt-8 p-6 rounded-lg bg-gray-800 shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-teal-300">
              Generated Story:
            </h3>
            <p className="whitespace-pre-line text-teal-100">{story}</p>

            {/* Generate Audio Button */}
            <button
              onClick={handleGenerateAudio}
              className="mt-6 px-5 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition duration-150"
              disabled={loading}
            >
              {loading ? "Generating Audio..." : "Generate Audio"}
            </button>
          </div>
        )}

        {/* Display Audio Players */}
        {Object.keys(audioUrls).length > 0 && <AudioPlayer audioUrls={audioUrls} />}
      </div>
    </div>
  );
}

export default UploadSection;
