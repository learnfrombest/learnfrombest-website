import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import './EnterpriseDashboard.css';

const ADMIN_EMAIL = 'mail.raghav.swaminathan@gmail.com';

const KOCHI_METRO_STORIES = [
  {
    id: 'story-kaloor-idp',
    station: 'Kaloor Metro Station',
    lineStop: 'Stop 01 • Wholesale Hub',
    businessName: 'Periyar Spice & FMCG Distributors',
    ownerName: 'Thomas Varghese',
    projectKey: 'IDP',
    projectId: 'PRJ-IDP',
    projectName: 'Intelligent Document Processing (IDP)',
    savingsLakhs: 10,
    savingsLabel: '₹10 Lakhs / year saved',
    quote:
      'Hi Sir! Every week 400+ supplier invoices pile up on our desk near Kaloor market. Hiring two data-entry staff costs ₹10 Lakhs per year, which we simply cannot afford. Can you build an Intelligent Document Processing system that reads PDFs and catches GST/rate mismatches automatically?',
    starterTasks: [
      {
        title: 'Extract supplier invoice line items & GST fields with AWS Textract + Bedrock',
        description:
          'Client Requirement (Kaloor Wholesale): Process 400+ weekly supplier PDFs automatically, extract vendor, HSN, GST, and total amount, and flag rate variances to save ₹10 Lakhs/year in manual entry.',
        priority: 'Critical',
        type: 'Story',
        points: 8
      },
      {
        title: 'Build Amazon Athena discrepancy audit query & S3 proof export',
        description:
          'Compare extracted invoice totals against purchase orders in S3 and generate an executive exception report for the owner.',
        priority: 'High',
        type: 'Task',
        points: 5
      }
    ]
  },
  {
    id: 'story-edappally-rag',
    station: 'Edappally Metro Station',
    lineStop: 'Stop 02 • Healthcare Corridor',
    businessName: 'Lulu-Side Multi-Specialty Clinic',
    ownerName: 'Dr. Meera Menon',
    projectKey: 'RAG',
    projectId: 'PRJ-RAG',
    projectName: 'Malayalam & English Patient Triage RAG',
    savingsLakhs: 12,
    savingsLabel: '₹12 Lakhs / year saved',
    quote:
      'Hi Sir! Our front desk near Edappally gets 300 daily WhatsApp queries about lab prep, insurance coverage, and doctor slots. Hiring a 24/7 call-center team costs ₹12 Lakhs/year. Can an AI assistant answer accurately from our hospital SOPs without hallucinating?',
    starterTasks: [
      {
        title: 'Index clinic SOPs & insurance policy PDFs into vector knowledge base',
        description:
          'Client Requirement (Edappally Clinic): Ground answers strictly in approved hospital documents with citation checks to save ₹12 Lakhs/year in support staffing.',
        priority: 'High',
        type: 'Story',
        points: 8
      }
    ]
  },
  {
    id: 'story-mgroad-frd',
    station: 'MG Road Metro Station',
    lineStop: 'Stop 03 • Retail & Jewellery Belt',
    businessName: 'Cochin Heritage Silks & Gold',
    ownerName: 'Subramanian Iyer',
    projectKey: 'FRD',
    projectId: 'PRJ-FRD',
    projectName: 'Real-Time POS & UPI Anomaly Guard',
    savingsLakhs: 15,
    savingsLabel: '₹15 Lakhs / year saved',
    quote:
      'Hi Sir! Across our 3 showrooms on MG Road, fake UPI payment screenshots and billing overrides cost us nearly ₹15 Lakhs/year. We cannot afford full-time audit staff at every counter—can AI flag suspicious transactions in real time?',
    starterTasks: [
      {
        title: 'Deploy Lambda + Bedrock real-time transaction anomaly scoring webhook',
        description:
          'Client Requirement (MG Road Retail): Score high-value POS and UPI settlements in under 200ms and alert the floor manager on suspicious mismatches.',
        priority: 'Critical',
        type: 'Story',
        points: 8
      }
    ]
  },
  {
    id: 'story-aluva-sup',
    station: 'Aluva Metro Terminal',
    lineStop: 'Stop 04 • Industrial & Logistics',
    businessName: 'Aluva Cold-Chain & Agro Exports',
    ownerName: 'Najeeb Kunju',
    projectKey: 'LOG',
    projectId: 'PRJ-LOG',
    projectName: 'Automated E-Way Bill & Customs Packager',
    savingsLakhs: 9,
    savingsLabel: '₹9 Lakhs / year saved',
    quote:
      'Hi Sir! Delayed E-Way bills and packing-list typos at Kochi Port cost us ₹9 Lakhs/year in detention penalties and overtime clerks. Can your AI generate error-free export packets straight from our dispatch sheet?',
    starterTasks: [
      {
        title: 'Automate packing list & E-Way bill validation with Python Lambda',
        description:
          'Client Requirement (Aluva Exports): Validate HS codes, weights, and consignee GSTINs automatically before container dispatch.',
        priority: 'High',
        type: 'Story',
        points: 5
      }
    ]
  }
];

export default function EnterpriseDashboard({ onSignOut, userEmail, isAdmin }) {
  const navigate = useNavigate();

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('lfb_projects');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('lfb_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [storyFeedback, setStoryFeedback] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom Kochi Story / Client Requirement Form
  const [customStation, setCustomStation] = useState('Vyttila Mobility Hub');
  const [customBusiness, setCustomBusiness] = useState('');
  const [customProjectName, setCustomProjectName] = useState('');
  const [customProjectKey, setCustomProjectKey] = useState('');
  const [customSavings, setCustomSavings] = useState(10);
  const [customQuote, setCustomQuote] = useState('');

  useEffect(() => {
    const syncToken = async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString() || '';
        const email = (session.tokens?.idToken?.payload?.email || userEmail || '').toLowerCase();
        if (email === ADMIN_EMAIL && idToken) {
          localStorage.setItem('lfb_admin_jwt', idToken);
          localStorage.setItem('lfb_admin_email', email);
        }
      } catch (e) {
        console.warn('Token sync skipped:', e);
      }
    };
    syncToken();
  }, [userEmail]);

  const currentStory = KOCHI_METRO_STORIES[activeStoryIndex];

  // Calculate total annual INR Lakhs saved across accepted projects
  const totalLakhsSaved = projects.reduce(
    (sum, p) => sum + (Number(p.savingsLakhs) || 10),
    0
  );

  const completedProjectsCount = projects.filter((proj) => {
    const projTasks = tasks.filter((t) => t.projectId === proj.id);
    return (
      proj.status === 'Done' ||
      (projTasks.length > 0 && projTasks.every((t) => t.status === 'Done'))
    );
  }).length;

  const isCurrentStoryAccepted = projects.some(
    (p) => p.id === currentStory.projectId || p.name === currentStory.projectName
  );

  const acceptStoryRequirement = (storyObj, goStraightToBoard = false) => {
    const cleanKey = storyObj.projectKey.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const projId = storyObj.projectId || `PRJ-${cleanKey}`;

    const existingIndex = projects.findIndex(
      (p) => p.id === projId || p.name.toLowerCase() === storyObj.projectName.toLowerCase()
    );

    const newProjectRecord = {
      id: projId,
      key: cleanKey,
      name: storyObj.projectName,
      lead: 'Raghav Swaminathan',
      station: storyObj.station,
      businessName: storyObj.businessName,
      savingsLakhs: Number(storyObj.savingsLakhs) || 10,
      desc: storyObj.quote
    };

    const updatedProjects =
      existingIndex >= 0
        ? projects.map((p, idx) => (idx === existingIndex ? { ...p, ...newProjectRecord } : p))
        : [newProjectRecord, ...projects];

    const newTasksToAdd = (storyObj.starterTasks || []).map((st, idx) => ({
      id: `${cleanKey}-${101 + idx}`,
      projectId: projId,
      title: st.title,
      description: st.description,
      status: 'To Do',
      priority: st.priority || 'High',
      type: st.type || 'Story',
      assignee: 'Raghav Swaminathan',
      points: st.points || 5,
      dueDate: '2026-11-28',
      comments: [
        {
          id: `c-story-${Date.now()}-${idx}`,
          author: `${storyObj.ownerName} (${storyObj.station})`,
          text: `"${storyObj.quote}" — Target ROI: ₹${storyObj.savingsLakhs} Lakhs/year saved.`,
          timestamp: new Date().toISOString(),
          isCompletion: false
        }
      ],
      proofs: []
    }));

    // Avoid duplicating starter tasks if already accepted
    const existingTaskIds = new Set(tasks.map((t) => t.id));
    const filteredNewTasks = newTasksToAdd.filter((t) => !existingTaskIds.has(t.id));
    const updatedTasks = [...filteredNewTasks, ...tasks];

    setProjects(updatedProjects);
    setTasks(updatedTasks);
    localStorage.setItem('lfb_projects', JSON.stringify(updatedProjects));
    localStorage.setItem('lfb_tasks', JSON.stringify(updatedTasks));

    setStoryFeedback(
      `✓ Requirement accepted! "${storyObj.projectName}" (₹${storyObj.savingsLakhs}L/yr impact) added to your Jira Board.`
    );

    if (goStraightToBoard) {
      navigate('/workspace');
    }
  };

  const handleCustomStorySubmit = (e) => {
    e.preventDefault();
    if (!customProjectName.trim() || !customProjectKey.trim()) return;
    const cleanKey = customProjectKey.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const customStoryObj = {
      station: customStation.trim() || 'Kochi Metro',
      businessName: customBusiness.trim() || 'Kochi Local Enterprise',
      ownerName: 'Business Owner',
      projectKey: cleanKey,
      projectId: `PRJ-${cleanKey}`,
      projectName: customProjectName.trim(),
      savingsLakhs: Number(customSavings) || 10,
      quote:
        customQuote.trim() ||
        `Hi Sir! We want ${customProjectName.trim()} to save ₹${customSavings} Lakhs per year without hiring additional staff.`,
      starterTasks: [
        {
          title: `Architect & Deploy ${customProjectName.trim()} AWS Lambda Pipeline`,
          description:
            customQuote.trim() ||
            `Deliver automated AI workflow for ${customBusiness.trim() || 'Kochi client'} targeting ₹${customSavings} Lakhs/year savings.`,
          priority: 'High',
          type: 'Story',
          points: 8
        }
      ]
    };

    acceptStoryRequirement(customStoryObj, false);
    setCustomBusiness('');
    setCustomProjectName('');
    setCustomProjectKey('');
    setCustomQuote('');
    setShowCustomModal(false);
  };

  const openProtectedStudio = async (path) => {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString() || '';
      const email = (session.tokens?.idToken?.payload?.email || userEmail || '').toLowerCase();

      if (email !== ADMIN_EMAIL || !idToken) {
        alert('Live AWS Studio access is restricted to the workspace owner.');
        return;
      }

      localStorage.setItem('lfb_admin_jwt', idToken);
      localStorage.setItem('lfb_admin_email', email);
      window.open(path, '_blank', 'noopener,noreferrer');
    } catch {
      alert('Unable to verify Cognito session. Please sign in again.');
    }
  };

  return (
    <div className="enterprise-dashboard">
      {/* Top Navbar */}
      <header className="ed-header">
        <div className="ed-brand">
          <div className="ed-logo">L</div>
          <span className="ed-brand-title">LearnFromBest</span>
          <span className="ed-channel-pill">MALLU MAKES MONEY • KOCHI</span>
          {isAdmin && <span className="ed-owner-badge">OWNER</span>}
        </div>

        <div className="ed-header-actions">
          {userEmail && <span className="ed-user-email">{userEmail}</span>}
          <button
            type="button"
            className="ed-btn-secondary"
            onClick={() => navigate('/home')}
          >
            Home
          </button>
          {onSignOut && (
            <button
              type="button"
              className="ed-btn-signout"
              onClick={onSignOut}
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* Main Story-Driven Command Center */}
      <main className="ed-main">
        {/* Compact Impact & Progress Strip */}
        <div className="ed-impact-strip">
          <div className="ed-impact-item">
            <span className="ed-impact-label">CLIENT VALUE PIPELINE</span>
            <strong className="ed-impact-value green">₹{totalLakhsSaved} Lakhs / yr</strong>
          </div>
          <div className="ed-impact-item">
            <span className="ed-impact-label">ACTIVE CLIENT MISSIONS</span>
            <strong className="ed-impact-value cyan">{projects.length}</strong>
          </div>
          <div className="ed-impact-item">
            <span className="ed-impact-label">SHIPPED &amp; VERIFIED</span>
            <strong className="ed-impact-value amber">{completedProjectsCount}</strong>
          </div>
          <button
            type="button"
            className="ed-btn-custom-story"
            onClick={() => setShowCustomModal(true)}
          >
            ＋ Record Custom Client Story
          </button>
        </div>

        {/* Kochi Metro Line Station Selector */}
        <div className="ed-metro-bar">
          <div className="ed-metro-header">
            <span className="ed-metro-badge">🚇 KOCHI METRO LINE • CLIENT DISCOVERY JOURNEY</span>
            <span className="ed-metro-hint">Select a station stop to meet a local business owner</span>
          </div>

          <div className="ed-stations-track">
            {KOCHI_METRO_STORIES.map((st, idx) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setActiveStoryIndex(idx);
                  setStoryFeedback('');
                }}
                className={`ed-station-btn ${idx === activeStoryIndex ? 'active' : ''}`}
              >
                <span className="ed-station-dot" />
                <div className="ed-station-meta">
                  <span className="ed-station-stop">{st.lineStop}</span>
                  <strong className="ed-station-name">{st.station}</strong>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Story Encounter Card */}
        <section className="ed-story-card">
          <div className="ed-story-top">
            <div>
              <div className="ed-story-location">
                📍 Stepping off at <strong>{currentStory.station}</strong> → Visiting <strong>{currentStory.businessName}</strong>
              </div>
              <h2 className="ed-story-project-title">
                Proposed Solution: <span>{currentStory.projectName}</span>
              </h2>
            </div>
            <div className="ed-roi-badge">
              {currentStory.savingsLabel}
            </div>
          </div>

          {/* Client Dialogue Bubble */}
          <div className="ed-dialogue-box">
            <div className="ed-avatar-client">🧑‍💼</div>
            <div className="ed-dialogue-content">
              <div className="ed-speaker-name">
                {currentStory.ownerName} • Owner, {currentStory.businessName}
              </div>
              <p className="ed-dialogue-text">“{currentStory.quote}”</p>
            </div>
          </div>

          {/* Architect Action Bar */}
          <div className="ed-story-actions">
            <button
              type="button"
              className="ed-btn-accept"
              onClick={() => acceptStoryRequirement(currentStory, false)}
            >
              {isCurrentStoryAccepted
                ? `✓ Requirement Captured (${currentStory.projectKey})`
                : `🤝 Accept Requirement & Add "${currentStory.projectName}"`}
            </button>

            <button
              type="button"
              className="ed-btn-accept-go"
              onClick={() => acceptStoryRequirement(currentStory, true)}
            >
              🚀 Accept &amp; Open Jira Board →
            </button>

            <button
              type="button"
              className="ed-btn-next-stop"
              onClick={() => {
                setActiveStoryIndex((prev) => (prev + 1) % KOCHI_METRO_STORIES.length);
                setStoryFeedback('');
              }}
            >
              Next Metro Stop ⏭
            </button>
          </div>

          {storyFeedback && (
            <div className="ed-feedback-banner">{storyFeedback}</div>
          )}
        </section>

        {/* Bottom Studio Launchers */}
        <div className="ed-nav-panel">
          <button
            type="button"
            className="ed-btn-jira"
            onClick={() => navigate('/workspace')}
          >
            <span>▦ Open Jira Board &amp; Client Requirements ({projects.length} Projects)</span>
            <span>→</span>
          </button>

          <div className="ed-tools-row">
            <button
              type="button"
              className="ed-btn-tool arch"
              onClick={() => openProtectedStudio('/architecture_builder.html')}
            >
              <span>❖ Solution Architecture Diagram</span>
              <span>↗</span>
            </button>

            <button
              type="button"
              className="ed-btn-tool lambda"
              onClick={() => openProtectedStudio('/lambda_studio.html')}
            >
              <span>🐍 Python &amp; AWS Lambda Editor</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </main>

      {/* Custom Client Requirement Modal */}
      {showCustomModal && (
        <div className="ed-modal-backdrop">
          <div className="ed-modal">
            <h3>Capture Custom Kochi Client Requirement</h3>
            <form className="ed-form" onSubmit={handleCustomStorySubmit}>
              <div className="ed-form-row">
                <div>
                  <label className="ed-label">METRO STATION / AREA</label>
                  <input
                    type="text"
                    value={customStation}
                    onChange={(e) => setCustomStation(e.target.value)}
                    placeholder="e.g. Vyttila / Kakkanad"
                    className="ed-input"
                  />
                </div>
                <div>
                  <label className="ed-label">ANNUAL SAVINGS (₹ LAKHS)</label>
                  <input
                    type="number"
                    min="1"
                    value={customSavings}
                    onChange={(e) => setCustomSavings(e.target.value)}
                    className="ed-input"
                  />
                </div>
              </div>

              <div>
                <label className="ed-label">BUSINESS NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Kakkanad Tech Park Cafeteria"
                  value={customBusiness}
                  onChange={(e) => setCustomBusiness(e.target.value)}
                  className="ed-input"
                />
              </div>

              <div className="ed-form-row">
                <div>
                  <label className="ed-label">PROJECT NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Intelligent Document Processing"
                    value={customProjectName}
                    onChange={(e) => setCustomProjectName(e.target.value)}
                    className="ed-input"
                  />
                </div>
                <div>
                  <label className="ed-label">KEY (3-5 LETTERS) *</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="IDP"
                    value={customProjectKey}
                    onChange={(e) => setCustomProjectKey(e.target.value.toUpperCase())}
                    className="ed-input mono"
                  />
                </div>
              </div>

              <div>
                <label className="ed-label">CLIENT PROBLEM STATEMENT</label>
                <textarea
                  rows={3}
                  placeholder="Hi Sir! I want an Intelligent Document Processing solution that saves ₹10 Lakhs/year..."
                  value={customQuote}
                  onChange={(e) => setCustomQuote(e.target.value)}
                  className="ed-input"
                />
              </div>

              <div className="ed-modal-actions">
                <button
                  type="button"
                  className="ed-btn-secondary"
                  onClick={() => setShowCustomModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ed-btn-primary">
                  Add Requirement &amp; Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
