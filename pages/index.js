import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a CSV file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ File uploaded successfully!");
      } else {
        setMessage("❌ Upload failed: " + result.error);
      }
    } catch (error) {
      setMessage("❌ Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <h1>CSV Upload System</h1>
      <div className="upload-box">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>
      {message && <p className="message">{message}</p>}

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }

        html, body {
          height: 100%;
          background-color: #0D0D0D;
          color: #E0E0E0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .container {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #0D0D0D;
        }

        h1 {
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: bold;
        }

        .upload-box {
          background: #1A1A1A;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 350px;
        }

        input {
          background: #222;
          color: #E0E0E0;
          border: 1px solid #444;
          padding: 10px;
          border-radius: 5px;
          width: 100%;
          margin-bottom: 15px;
          text-align: center;
        }

        button {
          background: linear-gradient(135deg, #FF5722, #D84315);
          color: white;
          border: none;
          padding: 12px 20px;
          cursor: pointer;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          width: 100%;
          box-shadow: 0px 4px 6px rgba(255, 87, 34, 0.3);
          transition: all 0.3s ease-in-out;
        }

        button:hover {
          background: linear-gradient(135deg, #D84315, #BF360C);
          box-shadow: 0px 6px 12px rgba(255, 87, 34, 0.5);
          transform: scale(1.05);
        }

        button:active {
          transform: scale(0.98);
        }

        button:disabled {
          background: #555;
          cursor: not-allowed;
          box-shadow: none;
        }

        .message {
          margin-top: 15px;
          font-size: 14px;
          font-weight: bold;
          text-align: center;
        }

        @media (max-width: 500px) {
          .upload-box {
            width: 90%;
          }
        }
      `}</style>
    </div>
  );
}