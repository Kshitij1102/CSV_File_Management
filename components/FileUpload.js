import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Store file
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Append file

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData, // Send as multipart/form-data
      });

      const result = await response.json();
      setMessage(result.message || "Upload successful!");
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setMessage("❌ Upload failed.");
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
}
