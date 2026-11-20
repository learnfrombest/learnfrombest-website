import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import './EnterpriseDashboard.css';

const ADMIN_EMAIL = 'mail.raghav.swaminathan@gmail.com';

const DEFAULT_PROJECTS = [
  { id: 'PRJ-IDP', key: 'IDP', name: 'Intelligent Document Processing (IDP)', lead: 'Raghav Swaminathan', desc: 'OCR & Bedrock pipeline for multi-format invoices.' },
  { id: 'PRJ-RAG', key: 'RAG', name: 'Enterprise Knowledge Assistant (RAG)', lead: 'Priya Nair', desc: 'Bedrock Knowledge Base + OpenSearch retrieval.' },
  { id: 'PRJ-FRD', key: 'FRD', name: 'Fraud & Transaction Anomaly Platform', lead: 'Arun Menon', desc: 'Real-time transaction risk scoring with Lambda.' }
];

export default function EnterpriseDashboard({ onSignOut, userEmail, isAdmin }) {
  const navigate = useNavigate();

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('lfb_projects');
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  });

  const [tasks] = useState(() => {
    try {
      const saved = localStorage.getItem('lfb_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showNewModal, setShowNewModal] = useState(false);
  const [projName, setProjName] = useState('');
  const [projKey, setProjKey] = useState('');

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

  const projectStats = projects.reduce(
    (acc, proj) => {
      const projTasks = tasks.filter((t) => t.projectId === proj.id);
      const isDone =
        proj.status === 'Done' ||
        (projTasks.length > 0 && projTasks.every((t) => t.status === 'Done'));
      if (isDone) acc.done.push(proj);
      else acc.inProgress.push(proj);
      return acc;
    },
    { done: [], inProgress: [] }
  );

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projName.trim() || !projKey.trim()) return;
    const cleanKey = projKey.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleanKey) return;

    const newProject = {
      id: `PRJ-${cleanKey}`,
      key: cleanKey,
      name: projName.trim(),
      lead: 'Raghav Swaminathan',
      desc: 'AI Engineering & AWS Lambda initiative.'
    };

    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem('lfb_projects', JSON.stringify(updated));
    setProjName('');
    setProjKey('');
    setShowNewModal(false);
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
          {isAdmin && <span className="ed-owner-badge">OWNER ACCESS</span>}
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

      {/* Main Dashboard */}
      <main className="ed-main">
        <div className="ed-hero">
          <h1>AI Engineering Command Center</h1>
          <p>
            Track shipped projects, start new AI builds, and launch your Jira board or AWS studios.
          </p>
        </div>

        {/* 3 Core Project Cards */}
        <div className="ed-stats-grid">
          {/* 1. Projects Done */}
          <div className="ed-stat-card done">
            <div className="ed-stat-label">1. Projects Done</div>
            <div className="ed-stat-count">{projectStats.done.length}</div>
            <div className="ed-stat-sub">
              {projectStats.done.length > 0
                ? projectStats.done.map((p) => p.name).join(', ')
                : 'Complete all tasks in a project to mark it Done'}
            </div>
          </div>

          {/* 2. Projects In Progress */}
          <div className="ed-stat-card progress">
            <div className="ed-stat-label">2. Projects In Progress</div>
            <div className="ed-stat-count">{projectStats.inProgress.length}</div>
            <div className="ed-stat-sub">
              {projectStats.inProgress.map((p) => `[${p.key}] ${p.name}`).join(' • ')}
            </div>
          </div>

          {/* 3. Create New Project */}
          <button
            type="button"
            className="ed-create-card"
            onClick={() => setShowNewModal(true)}
          >
            <div className="ed-create-tag">3. New Initiative</div>
            <div className="ed-create-title">＋ Create New Project</div>
            <div className="ed-create-sub">
              Spin up a new AI use-case board &amp; Lambda task stream
            </div>
          </button>
        </div>

        {/* Navigation Buttons Below */}
        <div className="ed-nav-panel">
          <button
            type="button"
            className="ed-btn-jira"
            onClick={() => navigate('/workspace')}
          >
            <span>▦ Open Jira Board &amp; Task Workspace</span>
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

      {/* Create New Project Modal */}
      {showNewModal && (
        <div className="ed-modal-backdrop">
          <div className="ed-modal">
            <h3>Create New AI Project</h3>
            <form className="ed-form" onSubmit={handleCreateProject}>
              <div>
                <label className="ed-label">PROJECT NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LangGraph Invoice Auditor"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  className="ed-input"
                />
              </div>
              <div>
                <label className="ed-label">PROJECT KEY (3-5 LETTERS)</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  placeholder="AUD"
                  value={projKey}
                  onChange={(e) => setProjKey(e.target.value.toUpperCase())}
                  className="ed-input mono"
                />
              </div>
              <div className="ed-modal-actions">
                <button
                  type="button"
                  className="ed-btn-secondary"
                  onClick={() => setShowNewModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ed-btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}