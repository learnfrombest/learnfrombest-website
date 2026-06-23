import React, { useState, useEffect } from "react";
import "./ManufacturingAutomation.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

function ManufacturingAutomation() {

  const [iotData, setIotData] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [predictions,setPredictions] =useState([]);
  const loadIotData = async () => {

      try {

        const response = await fetch(
          "https://manufacturing-ai-f0f8gufge6a6bfdj.ukwest-01.azurewebsites.net/api/iot-stream"
        );

        const data = await response.json();

        setIotData(data);

      } catch (err) {

        console.error(err);
      }
    };
  const askCopilot = async () => {

      if (!question.trim()) {
        alert("Please enter a question");
        return;
      }

      setCopilotLoading(true);
      setAnswer("");

      try {

        const response = await fetch(
          "https://manufacturing-ai-f0f8gufge6a6bfdj.ukwest-01.azurewebsites.net/api/manufacturing-copilot",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              question: question
            })
          }
        );

        const data = await response.json();

        if (response.ok) {
          setAnswer(data.answer);
        } else {
          setAnswer(
            "Error: " +
            (data.error || "Unable to process question")
          );
        }

      } catch (err) {
        console.error("Copilot error:", err);
        setAnswer("Error connecting to copilot. Please try again.");
      } finally {
        setCopilotLoading(false);
      }
    };
 
  const loadPredictions = async () => {

      try {

        const response = await fetch(
          "https://manufacturing-ai-f0f8gufge6a6bfdj.ukwest-01.azurewebsites.net/api/predictive-maintenance"
        );

        const data = await response.json();

        setPredictions(data);

      } catch (err) {

        console.error(err);
      }
    };
  const loadDashboard = async () => {


    try {

      const response = await fetch(
        "https://manufacturing-ai-f0f8gufge6a6bfdj.ukwest-01.azurewebsites.net/api/manufacturing-summary"
      );
      

      const data = await response.json();

      setSummary(data);


    } catch (err) {

      console.error(err);
    }
    };
    const shiftData =
      Object.values(

      trends.reduce((acc,row)=>{

      if(!acc[row.shift]){

      acc[row.shift]={
      shift: row.shift,
      production:0
      };
      }

      acc[row.shift].production +=
      row.production;

      return acc;

      },{})
      );
      const machineHealth =
        Object.values(

        trends.reduce((acc,row)=>{

        if(!acc[row.machine_id]){

        acc[row.machine_id]={
        machine: row.machine_id,
        score:100
        };
        }

        acc[row.machine_id].score -=
        row.defects;

        acc[row.machine_id].score -=
        row.downtime * 0.1;

        return acc;

        },{})
        );
      const anomalyCount =
      trends.filter(
      x => x.anomaly_flag===1
      ).length;
      const defectData = [
      {
      name:"Defects",
      value:
      trends.reduce(
      (a,b)=>a+b.defects,
      0
      )
      },
      {
      name:"Good Units",
      value:
      trends.reduce(
      (a,b)=>a+b.production,
      0
      )
      }
      ];
      const maintenanceCount =
      trends.filter(
      x => x.maintenance_alert==="Yes"
      ).length;
      const plantData =
    Object.values(

    trends.reduce((acc,row)=>{

    if(!acc[row.plant_id]){

    acc[row.plant_id]={
    plant: row.plant_id,
    production:0
    };
    }

    acc[row.plant_id].production +=
    row.production;

    return acc;

    },{})
    );
  const loadTrends = async () => {
  try {

    const response = await fetch(
      "https://manufacturing-ai-f0f8gufge6a6bfdj.ukwest-01.azurewebsites.net/api/manufacturing-trends"
    );

    const data = await response.json();

    setTrends(data);

  } catch (err) {
    console.error(err);
  }
  };

  useEffect(() => {

    loadDashboard();
    loadTrends();
    loadPredictions();
    loadIotData();

    const interval =
      setInterval(loadIotData, 10000);

      return () =>
      clearInterval(interval);

    }, []);

  const handleUpload = async () => {

    if (!file) {
      alert("Select a CSV");
      return;
    }

    try {

      setMessage("Getting upload URL...");

      const sasResponse = await fetch(
      "https://manufacturing-ai-f0f8gufge6a6bfdj.ukwest-01.azurewebsites.net/api/generatesasurl"
    );
      

      const sasData = await sasResponse.json();

      const uploadResponse = await fetch(
        sasData.uploadUrl,
        {
          method: "PUT",
          headers: {
            "x-ms-blob-type": "BlockBlob"
          },
          body: file
        }
      );

      if (uploadResponse.ok) {

        setMessage("✅ Upload successful");

        // Refresh KPI data
        await loadDashboard();

      } else {

        setMessage("❌ Upload failed");
      }

    } catch (err) {

      console.error(err);

      setMessage("❌ Upload failed");
    }
  };
  const kpis = [
      { title: "Total Records", value: summary?.totalRecords },
      { title: "Machine Count", value: summary?.machineCount },
      { title: "Average Temperature", value: summary?.avgTemperature?.toFixed(2) },
      { title: "Average Pressure", value: summary?.avgPressure?.toFixed(2) },
      { title: "Average Vibration", value: summary?.avgVibration?.toFixed(2) },
      { title: "Average RPM", value: summary?.avgRpm?.toFixed(2) },
      { title: "Average Power Consumption", value: summary?.avgPowerConsumption?.toFixed(2) },
      { title: "Average Voltage", value: summary?.avgVoltage?.toFixed(2) },
      { title: "Average Current", value: summary?.avgCurrent?.toFixed(2) },
      { title: "Average Humidity", value: summary?.avgHumidity?.toFixed(2) },
      { title: "Average Noise Level", value: summary?.avgNoiseLevel?.toFixed(2) },
      { title: "Average Cycle Time", value: summary?.avgCycleTime?.toFixed(2) },
      { title: "Total Production", value: summary?.totalProduction },
      { title: "Total Defects", value: summary?.totalDefects },
      { title: "Total Downtime", value: summary?.totalDowntime },
      { title: "Maintenance Alerts", value: summary?.maintenanceAlerts },
      { title: "Anomaly Count", value: summary?.anomalyCount },
      { title: "Max Temperature", value: summary?.maxTemperature?.toFixed(2) },
      { title: "Min Temperature", value: summary?.minTemperature?.toFixed(2) },
      { title: "Quality Score", value: summary?.avgQualityScore?.toFixed(2) },
      { title: "Energy Cost", value: summary?.totalEnergyCost?.toFixed(2) }
    ];

    console.log(trends);
    console.log("Prediction count:",
    predictions.length);
  return (
    <div className="manufacturing-page">

      <div className="manufacturing-overview">

        <h2>🏭 Manufacturing AI</h2>

        <p className="industry-tagline">Real-time IoT monitoring, predictive maintenance, and AI-powered operations platform</p>

        <div className="overview-blocks">

          <div className="overview-block">
            <h3>Problem Statement</h3>
            <p>
              Manufacturing plants generate massive IoT sensor data across machines and plants,
              but struggle to detect anomalies in real time, predict machine failures before they occur,
              and get unified visibility across multiple production facilities.
            </p>
          </div>

          <div className="overview-block">
            <h3>Objective</h3>
            <p>
              Build an AI-powered manufacturing operations platform that streams IoT sensor data,
              detects anomalies in real time, predicts maintenance needs using machine learning,
              and provides an AI Copilot for natural language queries on operational data.
            </p>
          </div>

        </div>

        <div className="solution-steps">
          <h3>Solution Architecture</h3>
          <div className="steps-flow">
            <span className="step-pill">🔌 IoT Sensors</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">☁️ Azure IoT Hub</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">⚡ Azure Functions API</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">⚛️ React Dashboard</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">📈 Real-time Charts</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">🤖 AI Copilot</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">🔧 Predictive Maintenance</span>
          </div>
        </div>

      </div>

      <p className="manufacturing-demo-title">— Live Demo —</p>

      <div className="manufacturing-inner">

      <h1>Manufacturing AI</h1>

      <input
        type="file"
        accept=".csv"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <button onClick={handleUpload}>
        Upload Manufacturing CSV
      </button>

      <p>{message}</p>

      <hr />

      <h2>Manufacturing Dashboard</h2>

      {summary ? (

      <>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px"
          }}
        >
          {kpis.map((kpi) => (
            <div
              key={kpi.title}
              style={{
                background: "white",
                color: "#222",
                padding: "20px",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.2)"
              }}
            >
              <h3>{kpi.title}</h3>
              <h2>{kpi.value}</h2>
            </div>
          ))}
        </div>
            <div
      style={{
        background:
          "rgba(59, 130, 246, 0.1)",
        padding: "30px",
        borderRadius: "20px",
        border:
          "1px solid rgba(59, 130, 246, 0.3)",
        marginBottom: "30px",
        marginTop: "30px"
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "15px",
          fontSize: "28px",
          fontWeight: "bold"
        }}
      >
        🤖 AI Manufacturing Copilot
      </h2>

      <p
        style={{
          color: "rgba(255, 255, 255, 0.8)",
          marginBottom: "15px",
          fontSize: "16px"
        }}
      >
        Ask questions about your manufacturing data
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "15px"
        }}
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) =>
            e.key === "Enter" && askCopilot()
          }
          placeholder="e.g., Which machine has the most downtime? What's the defect rate?"
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            fontSize: "16px",
            background: "white",
            color: "#222"
          }}
          disabled={copilotLoading}
        />

        <button
          onClick={askCopilot}
          disabled={copilotLoading}
          style={{
            padding: "14px 28px",
            borderRadius: "12px",
            border: "none",
            background:
              copilotLoading
                ? "#666"
                : "#3b82f6",
            color: "white",
            cursor:
              copilotLoading
                ? "not-allowed"
                : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "0.3s",
            minWidth: "120px"
          }}
        >
          {copilotLoading ? "Asking..." : "Ask AI"}
        </button>
      </div>

      {answer && (
        <div
          style={{
            background:
              "rgba(255, 255, 255, 0.08)",
            padding: "20px",
            borderRadius: "12px",
            border:
              "1px solid rgba(255, 255, 255, 0.12)",
            whiteSpace: "pre-wrap",
            color: "rgba(255, 255, 255, 0.9)",
            lineHeight: "1.6",
            maxHeight: "400px",
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "14px"
          }}
        >
          {answer}
        </div>
      )}

      <div
        style={{
          marginTop: "15px",
          padding: "12px",
          background:
            "rgba(255, 255, 255, 0.05)",
          borderRadius: "8px",
          fontSize: "13px",
          color: "rgba(255, 255, 255, 0.6)"
        }}
      >
        <strong>Try asking about:</strong>
        <br />• Downtime analysis • Defect rates
        • Temperature • Production • Maintenance alerts
        • Anomalies • Machine health • Shift performance
        • Plant comparison
      </div>
    </div>

        <h2
          style={{
            color: "white",
            marginTop: "40px"
          }}
        >
          Temperature Trend
        </h2>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            marginTop: "20px"
          }}
        >
          <ResponsiveContainer
            width="100%"
            height={400}
          >
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="timestamp" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>
          <h2 style={{ color: "black",marginTop: "40px",marginBottom: "15px",
            fontSize: "28px",
            fontWeight: "bold"
                    }}>
            Production Trend
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="production"
                stroke="#00C49F"
              />
            </LineChart>
          </ResponsiveContainer>  
        <h2 style={{ color: "black",marginTop: "40px",marginBottom: "15px",
    fontSize: "28px",
    fontWeight: "bold"
                    }}>
          Defect Trend
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="defects"
              stroke="#FF8042"
            />
          </LineChart>
        </ResponsiveContainer> 
        <h2 style={{ color: "black",marginTop: "40px",marginBottom: "15px",
    fontSize: "28px",
    fontWeight: "bold"
                    }}>
          Downtime Trend
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="downtime"
              stroke="#FF0000"
            />
          </LineChart>
          </ResponsiveContainer>    
          <h2 style={{ color: "black",marginTop: "40px",marginBottom: "15px",
    fontSize: "28px",
    fontWeight: "bold"
                    }}>
            Manufacturing Operations
          </h2>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />

              <Line dataKey="temperature" stroke="#8884d8" />
              <Line dataKey="production" stroke="#00C49F" />
              <Line dataKey="defects" stroke="#FF8042" />
              <Line dataKey="downtime" stroke="#FF0000" />
            </LineChart>
          </ResponsiveContainer>   
          <h2 style={{ color: "black",marginTop: "40px",marginBottom: "15px",
    fontSize: "28px",
    fontWeight: "bold"
                    }}>
            Plant-wise Production Summary
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={plantData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plant" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="production"
                fill="#8884d8"
              />
            </BarChart>
          </ResponsiveContainer>  
                <h2 style={{ color: "black",marginTop: "40px",marginBottom: "15px",
    fontSize: "28px",
    fontWeight: "bold"
                    }}>
            Shift-wise Production Summary
          </h2>


      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={shiftData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="shift" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="production"
            fill="#00C49F"
          />
        </BarChart>
      </ResponsiveContainer> 
      <h2 style={{ color: "black",marginTop: "40px",marginBottom: "15px",
    fontSize: "28px",
    fontWeight: "bold"
                    }}>
            Machine Health Score
          </h2>     
                <ResponsiveContainer width="100%" height={350}>
        <BarChart data={machineHealth}>
          <XAxis dataKey="machine" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="score"
            fill="#FFBB28"
          />
        </BarChart>
      </ResponsiveContainer> 
       <h2 style={{ color: "black",marginTop: "40px",marginBottom: "15px",
    fontSize: "28px",
    fontWeight: "bold"
                    }}>
            Defect Analysis Pie Chart
          </h2> 
      <PieChart width={500} height={350}>

        <Pie
          data={defectData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          <Cell fill="#ff4d4f" />
          <Cell fill="#52c41a" />
        </Pie>

        <Tooltip />

        <Legend />

      </PieChart>
      <h2
      style={{
        color:"black",
        marginTop:"40px",
        marginBottom:"15px",
        fontSize:"28px",
        fontWeight:"bold"
      }}
    >
      Real-Time IoT Sensor Stream
    </h2>

    <div
      style={{
        background:"black",
        padding:"20px",
        borderRadius:"12px",
        overflowX:"auto"
      }}
    >
      <table
        style={{
          width:"100%",
          borderCollapse:"collapse"
        }}
      >
        <thead>
          <tr>
            <th>Machine</th>
            <th>Plant</th>
            <th>Temperature</th>
            <th>Vibration</th>
            <th>RPM</th>
            <th>Power</th>
            <th>Pressure</th>
            <th>Voltage</th>
            <th>Current</th>
          </tr>
        </thead>

        <tbody>
          {iotData.map((row,index)=>(

            <tr key={index}>
              <td>{row.machine_id}</td>
              <td>{row.plant_id}</td>
              <td>{row.temperature}</td>
              <td>{row.vibration}</td>
              <td>{row.rpm}</td>
              <td>{row.power_consumption}</td>
              <td>{row.pressure}</td>
              <td>{row.voltage}</td>
              <td>{row.current}</td>
            </tr>

          ))}
        </tbody>
      </table>
    </div>
          <h2
    style={{
      color:"black",
      marginTop:"40px",
      marginBottom:"15px",
      fontSize:"28px",
      fontWeight:"bold"
    }}
    >
    Predictive Maintenance
    </h2>

    <div
    style={{
      background:"white",
      padding:"20px",
      borderRadius:"12px",
      overflowX:"auto"
    }}
    >
    <table
    style={{
      width:"100%",
      borderCollapse:"collapse",
      color:"black"
    }}
    >
      <thead>
        <tr>
          <th>Machine</th>
          <th>Prediction</th>
          <th>Probability</th>
        </tr>
      </thead>

      <tbody>
        {predictions.map((m,index)=>(
          <tr key={index}>
            <td>{m.machine_id}</td>
            <td>
              {m.prediction === 1
                ? "Maintenance Required"
                : "Healthy"}
            </td>
            <td>{m.probability}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
      <h2 style={{ color: "black",marginTop: "40px",marginBottom: "15px",
    fontSize: "28px",
    fontWeight: "bold"
                    }}>
            Maintenance Dashboard
          </h2>

          <div
          style={{
            background: "black",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            width: "250px"
          }}
        >
          <h3>Maintenance Required</h3>
          <h2>{maintenanceCount}</h2>
        </div>
          <h2 style={{ color: "black",marginTop: "40px",marginBottom: "15px",
    fontSize: "28px",
    fontWeight: "bold"
                    }}>
            Anomaly Dashboard
          </h2> 
        <div
          style={{
            background: "black",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            width: "250px"
          }}
        >
          <h3>Anomalies</h3>
          <h2>{anomalyCount}</h2>
        </div>    
        
        </div>
      </>

      ) : (
        <p>Loading KPIs...</p>
      )}

      </div>

    </div>

  );
}

export default ManufacturingAutomation;