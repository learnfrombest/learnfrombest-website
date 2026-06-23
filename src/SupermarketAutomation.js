import React, { useState } from "react";
import "./SupermarketAutomation.css";
import NavBar from "./NavBar";

function SupermarketAutomation({ onSignOut }) {

  const [salesFile, setSalesFile] = useState(null);
  const [productsFile, setProductsFile] = useState(null);
  const [inventoryFile, setInventoryFile] = useState(null);
  const [storesFile, setStoresFile] = useState(null);

  const [message, setMessage] = useState("");

  const API_BASE =
    "http://localhost:8000";

  const uploadFile = async (file, endpoint, tableName) => {

    if (!file) {

      alert(`Please select ${tableName} file`);

      return;
    }

    try {

      setMessage(`Uploading ${tableName}...`);

      const formData = new FormData();

      formData.append(
        "file",
        file
      );

      const response = await fetch(

        `${API_BASE}${endpoint}`,

        {
          method: "POST",
          body: formData
        }
      );

      const data =
        await response.json();

      if (response.ok) {

        setMessage(

          `✅ ${tableName} uploaded successfully. Rows loaded: ${data.rows_loaded}`

        );

      } else {

        setMessage(

          `❌ ${tableName} upload failed`

        );
      }

    } catch (error) {

      console.error(error);

      setMessage(

        `❌ Error uploading ${tableName}`

      );
    }
  };

  const testSnowflake = async () => {

    try {

      const response = await fetch(
        `${API_BASE}/test-snowflake`
      );

      const data =
        await response.json();

      setMessage(

        `✅ Connected to Snowflake: ${data.snowflake_version}`

      );

    } catch (error) {

      console.error(error);

      setMessage(
        "❌ Snowflake connection failed"
      );
    }
  };

  return (

    <div className="supermarket-page">

      <NavBar onSignOut={onSignOut} />

      <div className="supermarket-overview" style={{ paddingTop: '64px' }}>

        <h2>🛒 Supermarket AI Analytics</h2>

        <p className="industry-tagline">Enterprise data warehouse and AI analytics platform for retail chains</p>

        <div className="overview-blocks">

          <div className="overview-block">
            <h3>Problem Statement</h3>
            <p>
              Supermarket chains deal with complex data across sales, inventory, products, and stores.
              Siloed data prevents unified analytics, making executive reporting difficult
              and slowing decisions on pricing, stock replenishment, and store performance.
            </p>
          </div>

          <div className="overview-block">
            <h3>Objective</h3>
            <p>
              Build an enterprise supermarket analytics platform that loads data into Snowflake,
              transforms it with dbt, visualizes insights in Streamlit dashboards,
              and enables natural language querying using Google Gemini AI.
            </p>
          </div>

        </div>

        <div className="solution-steps">
          <h3>Solution Architecture</h3>
          <div className="steps-flow">
            <span className="step-pill">⚛️ React Frontend</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">🐍 FastAPI Backend</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">❄️ Snowflake Data Warehouse</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">🔄 dbt Transformation</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">📊 Streamlit Analytics</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">🤖 Gemini AI Q&A</span>
          </div>
        </div>

      </div>

      <p className="supermarket-demo-title">— Live Demo —</p>

      <div className="supermarket-center">

      <div className="supermarket-card">

        <div className="supermarket-icon">
          🛒
        </div>

        <h1>
          AI Supermarket Analytics
        </h1>

        <p>
          Upload supermarket datasets directly
          into Snowflake and power your
          enterprise analytics platform.
        </p>

        {/* SALES */}

        <div className="upload-section">

          <h3>
            Sales Data
          </h3>

          <input
            type="file"
            accept=".csv"
            onChange={(e) =>
              setSalesFile(
                e.target.files[0]
              )
            }
          />

          <button
            className="sales-btn"
            onClick={() =>
              uploadFile(
                salesFile,
                "/upload/sales",
                "Sales"
              )
            }
          >
            Upload Sales CSV
          </button>

        </div>

        {/* PRODUCTS */}

        <div className="upload-section">

          <h3>
            Products Data
          </h3>

          <input
            type="file"
            accept=".csv"
            onChange={(e) =>
              setProductsFile(
                e.target.files[0]
              )
            }
          />

          <button
            className="products-btn"
            onClick={() =>
              uploadFile(
                productsFile,
                "/upload/products",
                "Products"
              )
            }
          >
            Upload Products CSV
          </button>

        </div>

        {/* INVENTORY */}

        <div className="upload-section">

          <h3>
            Inventory Data
          </h3>

          <input
            type="file"
            accept=".csv"
            onChange={(e) =>
              setInventoryFile(
                e.target.files[0]
              )
            }
          />

          <button
            className="inventory-btn"
            onClick={() =>
              uploadFile(
                inventoryFile,
                "/upload/inventory",
                "Inventory"
              )
            }
          >
            Upload Inventory CSV
          </button>

        </div>

        {/* STORES */}

        <div className="upload-section">

          <h3>
            Stores Data
          </h3>

          <input
            type="file"
            accept=".csv"
            onChange={(e) =>
              setStoresFile(
                e.target.files[0]
              )
            }
          />

          <button
            className="stores-btn"
            onClick={() =>
              uploadFile(
                storesFile,
                "/upload/stores",
                "Stores"
              )
            }
          >
            Upload Stores CSV
          </button>

        </div>

        <button
          className="snowflake-btn"
          onClick={testSnowflake}
        >
          ❄ Test Snowflake Connection
        </button>

        {message && (

          <div className="message-box">

            {message}

          </div>

        )}

      </div>

      </div>

    </div>
  );
}

export default SupermarketAutomation;