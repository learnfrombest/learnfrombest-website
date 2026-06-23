import React, { useState } from "react";
import "./FashionAutomation.css";

function FashionAutomation() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const API_URL =
    "https://pb5rzr5odf.execute-api.us-east-1.amazonaws.com/default/fashion-presigned-url-lambda";

  const DASHBOARD_URL =
    "https://us-east-1.quicksight.aws.amazon.com/sn/account/596575051579/dashboards/fe53379b-574c-4dfa-86b6-173065eae69a";

  const CHAT_AGENT_URL =
    "https://us-east-1.quicksight.aws.amazon.com/sn/account/596575051579/start/agents";

  const STORY_URL =
    "https://us-east-1.quicksight.aws.amazon.com/sn/account/596575051579/stories/c628f86c-0656-4700-8e71-d940586e9057/edit";

  const TOPIC_URL =
    "https://us-east-1.quicksight.aws.amazon.com/sn/account/596575051579/topics/fbi07wLyTSUmEhE6Pqe6Z84J4dRdMrBI/summary";

  const FLOW_URL =
    "https://us-east-1.quicksight.aws.amazon.com/sn/account/596575051579/flows/view/45c026f3-085e-4179-9a0e-e12ac78387c7";

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose an image");
      return;
    }

    try {
      setMessage("Generating upload URL...");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      const data = await response.json();

      console.log("API response:", data);

      if (!response.ok || !data.uploadUrl) {
        setMessage(data.error || "Presigned URL failed");
        return;
      }

      setMessage("Uploading image to S3...");

      const uploadResponse = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (uploadResponse.ok) {
        setMessage(
          "Upload successful! Rekognition will process this image."
        );
      } else {
        setMessage("Upload to S3 failed");
      }
    } catch (error) {
      console.error("FULL ERROR:", error);
      setMessage(error.message || "Upload failed");
    }
  };

  const openDashboard = () =>
    window.open(DASHBOARD_URL, "_blank", "noopener,noreferrer");

  const openAgent = () =>
    window.open(CHAT_AGENT_URL, "_blank", "noopener,noreferrer");

  const openStory = () =>
    window.open(STORY_URL, "_blank", "noopener,noreferrer");

  const openTopic = () =>
    window.open(TOPIC_URL, "_blank", "noopener,noreferrer");

  const openFlow = () =>
    window.open(FLOW_URL, "_blank", "noopener,noreferrer");

  return (
    <div className="fashion-page">

      <div className="fashion-overview">

        <h2>👗 Fashion AI Intelligence</h2>

        <p className="industry-tagline">AI-powered image recognition and retail analytics platform</p>

        <div className="overview-blocks">

          <div className="overview-block">
            <h3>Problem Statement</h3>
            <p>
              Fashion retailers need to analyze thousands of product images and sales data at scale,
              but lack AI-powered tools to automatically tag images, track inventory trends,
              and generate executive insights without manual effort.
            </p>
          </div>

          <div className="overview-block">
            <h3>Objective</h3>
            <p>
              Build an AI Fashion Intelligence platform using AWS Rekognition for image tagging,
              S3 for cloud storage, Athena for SQL analytics, and Amazon QuickSight for
              AI-powered dashboards, executive stories, forecasting, and chat agents.
            </p>
          </div>

        </div>

        <div className="solution-steps">
          <h3>Solution Architecture</h3>
          <div className="steps-flow">
            <span className="step-pill">⚛️ React</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">🔑 Lambda Presigned URL</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">🪣 S3 Storage</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">👁️ AWS Rekognition</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">⚡ Lambda Processing</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">🔍 Athena Analytics</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">📊 QuickSight AI Suite</span>
          </div>
        </div>

      </div>

      <p className="fashion-demo-title">— Live Demo —</p>

      <div className="fashion-center">
      <div className="fashion-card">
        <div className="fashion-icon">👗</div>

        <h1>AI Fashion Intelligence</h1>

        <p>
          Upload fashion product images. AWS Rekognition detects labels,
          stores results in S3, queries with Athena, and visualizes
          insights through Amazon QuickSight AI.
        </p>

        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          className="upload-btn"
          onClick={handleUpload}
        >
          Upload Fashion Image
        </button>

        {message && (
          <p className="fashion-message">
            {message}
          </p>
        )}

        <div className="dashboard-section">

          <h3 className="tools-title">
            Amazon Quick AI Suite
          </h3>

          <p className="dashboard-text">
            Explore AI-powered analytics, executive storytelling,
            forecasting, chat agents and natural language insights.
          </p>

          <div className="tools-grid">

            <button
              className="dashboard-btn"
              onClick={openDashboard}
            >
              📊 Executive Dashboard
            </button>

            <button
              className="agent-btn"
              onClick={openAgent}
            >
              🤖 Chat Agent
            </button>

            <button
              className="topic-btn"
              onClick={openTopic}
            >
              ❓ AI Topic Q&A
            </button>

            <button
              className="story-btn"
              onClick={openStory}
            >
              📖 Executive Story
            </button>

            <button
              className="flow-btn"
              onClick={openFlow}
            >
              🔮 Sales Predictor
            </button>

          </div>

        </div>
      </div>
      </div>
    </div>
  );
}

export default FashionAutomation;