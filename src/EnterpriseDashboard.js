import "./EnterpriseDashboard.css";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

function EnterpriseDashboard({ onSignOut }) {

  const navigate = useNavigate();

  const sections = [

    {
      title: "Banking Automation",
      icon: "🏦",
      action: () => navigate("/banking")
    },

    {
      title: "Supermarket",
      icon: "🛒",
      action: () => navigate("/supermarket")
    },

    {
      title: "Fashion Industry",
      icon: "👗",
      action: () => navigate("/fashion")
    },

    {
      title: "Manufacturing AI",
      icon: "🏭",
      action: () => navigate("/manufacturing")
    },

    
  ];

  return (

    <div className="enterprise-dashboard">

      <NavBar onSignOut={onSignOut} backLabel="← Home" />

      <div className="overlay"></div>

      <div className="dashboard-content" style={{ paddingTop: '64px' }}>

        <div className="hero-section">

          <h1>
            Enterprise AI Marketplace
          </h1>

          <p>
            Choose an industry workflow and explore AI automation solutions tailored for your business needs.
          </p>

        </div>

        <div className="card-grid">

          {sections.map((section) => (

            <div
              key={section.title}
              className="industry-card"
              onClick={section.action}
            >

              <div className="card-icon">
                {section.icon}
              </div>

              <h2>
                {section.title}
              </h2>

              <p>
                Enterprise AI automation
                workflows and analytics.
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default EnterpriseDashboard;