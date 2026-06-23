import React, { useState } from "react";
import "./BankingAutomation.css";

function BankingPage() {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {

  if (!file) {
    alert("Please choose a file");
    return;
  }

  try {

    console.log("STEP 1");

    const response = await fetch(
      "https://o57dagtic8.execute-api.us-east-1.amazonaws.com/default/generate-presigned-url",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type
        })
      }
    );

    console.log("STEP 2");

    const data = await response.json();

    console.log("API RESPONSE:", data);

    if (!data.uploadUrl) {

      console.log("NO URL RETURNED");

      setMessage("Presigned URL failed");

      return;
    }

    console.log("STEP 3");

    const uploadResponse = await fetch(data.uploadUrl, {

      method: "PUT",

      headers: {
        "Content-Type": file.type
      },

      body: file
    });

    console.log("UPLOAD RESPONSE:", uploadResponse);

    if (uploadResponse.ok) {

      setMessage("Upload successful!");

    } else {

      setMessage("Upload failed");
    }

  } catch (error) {

    console.error("FULL ERROR:", error);

    setMessage("Upload failed");
  }
};
  return (
    <div className="banking-page">

      <div className="industry-overview">

        <h2>🏦 Banking Automation</h2>

        <p className="industry-tagline">Enterprise AI analytics platform for banking transaction data</p>

        <div className="overview-blocks">

          <div className="overview-block">
            <h3>Problem Statement</h3>
            <p>
              Banks deal with large volumes of transaction data that need to be analyzed for fraud detection,
              customer behavior insights, and risk management. Manual analysis is slow, error-prone,
              and cannot scale to millions of transactions.
            </p>
          </div>

          <div className="overview-block">
            <h3>Objective</h3>
            <p>
              Build a cloud-native banking analytics platform where users can upload transaction files,
              store data in a data lake, analyze customer behavior with SQL, identify high-risk transactions,
              and generate executive dashboards for leadership.
            </p>
          </div>

        </div>

        <div className="solution-steps">
          <h3>Solution Architecture</h3>
          <div className="steps-flow">
            <span className="step-pill">⚛️ React Frontend</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">🪣 AWS S3 Data Lake</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">🔍 AWS Athena SQL Engine</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">📊 Power BI Dashboards</span>
          </div>
        </div>

      </div>

      <p className="demo-section-title">— Live Demo —</p>

      <div className="banking-center">

      <div className="upload-card">

        <h1>🏦 Banking Automation</h1>

        <p>
          Upload banking transaction files to trigger enterprise AI workflows.
        </p>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>
          Upload File
        </button>

        <p>{message}</p>

      </div>

      </div>

    </div>
  );
}

export default BankingPage;