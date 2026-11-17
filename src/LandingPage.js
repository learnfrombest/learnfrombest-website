import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage({ user, userEmail, onSignIn, onSignOut, onGoToDashboard }) {
  const navigate = useNavigate();
  const [activePreviewNode, setActivePreviewNode] = useState('harness');
  const [b2bLeadEmail, setB2bLeadEmail] = useState('');
  const [b2bCompany, setB2bCompany] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const nodeDetails = {
    eventbridge: {
      title: 'AWS EventBridge / ERP Trigger',
      badge: 'Event Ingestion',
      desc: 'Listens to ERP invoice webhooks, S3 document drops, or scheduled batch triggers with zero idle compute.'
    },
    harness: {
      title: 'Lambda + Harness Guardrail Engine',
      badge: 'Policy-as-Code Gate',
      desc: 'Enforces read-only SQL checks, PII redaction, least-privilege IAM, and $10k approval thresholds before execution.'
    },
    bedrock: {
      title: 'Amazon Bedrock & Hugging Face Models',
      badge: 'Multi-Model Inference',
      desc: 'Routes extraction and reasoning tasks across Claude 3.5 Sonnet and open-weight Hugging Face models.'
    },
    bigquery: {
      title: 'GCP BigQuery & Azure OpenAI',
      badge: 'Cross-Cloud Data & AI',
      desc: 'Queries enterprise data warehouses in BigQuery and reconciles ERP records across AWS, GCP, and Azure.'
    }
  };

  const handleLaunchSandbox = () => {
    if (user) {
      navigate('/workspace');
    } else {
      window.open('/architecture_builder.html?v=2', '_blank', 'noopener,noreferrer');
    }
  };

  const handleB2bDemoSubmit = (e) => {
    e.preventDefault();
    if (!b2bLeadEmail.trim()) return;
    setLeadSubmitted(true);
    setB2bLeadEmail('');
    setB2bCompany('');
  };

  return (
    <div className="lfb-page">
      {/* ─── TOP NAVIGATION BAR ─── */}
      <header className="lfb-navbar">
        <div className="lfb-nav-inner">
          <a href="#top" className="lfb-brand">
            <div className="lfb-logo-icon">L</div>
            <span className="lfb-brand-text">LearnFromBest</span>
          </a>

          <nav className="lfb-nav-links">
            <a href="#how-it-works">How It Works</a>
            <a href="#solutions">Solutions</a>
            <a href="#b2b-enterprise">B2B Enterprise</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <div className="lfb-nav-actions">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/workspace')}
                  className="lfb-btn-outline-sm"
                >
                  Open Workspace
                </button>
                <button onClick={onSignOut} className="lfb-btn-signin">
                  Sign Out
                </button>
              </>
            ) : (
              <button onClick={onSignIn} className="lfb-btn-signin">
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section id="top" className="lfb-hero">
        <div className="lfb-hero-grid">
          {/* Left Copy & Dual CTAs */}
          <div className="lfb-hero-left">
            <div className="lfb-pill-badge">
              <span className="lfb-dot-pulse"></span>
              <span>AI-ERP Orchestration & Multi-Cloud Governance</span>
            </div>

            <h1 className="lfb-hero-title">
              <span className="lfb-cyan">Design, Run,</span> and Verify{' '}
              <span className="lfb-cyan">Production</span> AI Agents
            </h1>

            <p className="lfb-hero-subtitle">
              With <span className="lfb-cyan-bold">Built-In Multi-Cloud Safety Guardrails</span>. Map AWS, GCP, Azure, and Hugging Face workflows visually, run sandboxed Python agents, and attach SHA-256 execution proofs to every ERP task.
            </p>

            <div className="lfb-hero-ctas">
              <button onClick={handleLaunchSandbox} className="lfb-btn-primary-glow">
                Try Live Sandbox (Free)
              </button>
              <a href="#b2b-enterprise" className="lfb-btn-secondary">
                Explore B2B Team Plans
              </a>
            </div>
          </div>

          {/* Right Interactive Blueprint Preview Card */}
          <div className="lfb-hero-right">
            <div className="lfb-window-card">
              {/* macOS Window Top Bar */}
              <div className="lfb-window-bar">
                <div className="lfb-traffic-lights">
                  <span className="dot-red"></span>
                  <span className="dot-yellow"></span>
                  <span className="dot-green"></span>
                </div>
                <div className="lfb-window-title">
                  <span className="mini-l">L</span> Solution Architecture Builder
                </div>
                <div className="lfb-window-badges">
                  <span className="win-tag">Harness v2</span>
                  <button
                    onClick={handleLaunchSandbox}
                    className="win-live-btn"
                  >
                    Live Preview ↗
                  </button>
                </div>
              </div>

              {/* Blueprint Canvas */}
              <div className="lfb-blueprint-canvas">
                <div className="bp-label">Blueprint • Autonomous AI-ERP Pipeline</div>

                <div className="bp-flow-stage">
                  {/* Node 1: EventBridge */}
                  <button
                    type="button"
                    onClick={() => setActivePreviewNode('eventbridge')}
                    className={`bp-node node-pink ${activePreviewNode === 'eventbridge' ? 'active' : ''}`}
                  >
                    <div className="bp-node-icon">⚡</div>
                    <div className="bp-node-name">AWS EventBridge</div>
                  </button>

                  <div className="bp-connector">──▶</div>

                  {/* Center Harness Box */}
                  <div className="bp-harness-frame">
                    <div className="bp-harness-tag">Connect & Govern</div>
                    <button
                      type="button"
                      onClick={() => setActivePreviewNode('harness')}
                      className={`bp-node node-amber ${activePreviewNode === 'harness' ? 'active' : ''}`}
                    >
                      <div className="bp-node-icon">λ</div>
                      <div className="bp-node-name">Lambda + Harness</div>
                    </button>
                  </div>

                  <div className="bp-connector">──▶</div>

                  {/* Right Multi-Cloud Targets */}
                  <div className="bp-targets-col">
                    <button
                      type="button"
                      onClick={() => setActivePreviewNode('bedrock')}
                      className={`bp-node node-emerald ${activePreviewNode === 'bedrock' ? 'active' : ''}`}
                    >
                      <div className="bp-node-icon">🧠</div>
                      <div className="bp-node-name">Bedrock + HF</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePreviewNode('bigquery')}
                      className={`bp-node node-blue ${activePreviewNode === 'bigquery' ? 'active' : ''}`}
                    >
                      <div className="bp-node-icon">📊</div>
                      <div className="bp-node-name">BigQuery / Azure</div>
                    </button>
                  </div>
                </div>

                {/* Interactive Node Inspector Strip */}
                <div className="bp-inspector">
                  <div className="bp-inspector-head">
                    <strong>{nodeDetails[activePreviewNode].title}</strong>
                    <span>{nodeDetails[activePreviewNode].badge}</span>
                  </div>
                  <p>{nodeDetails[activePreviewNode].desc}</p>
                </div>
              </div>
            </div>
            <div className="lfb-caption">Click any node above to inspect multi-cloud harness controls</div>
          </div>
        </div>

        {/* ─── 3-STEP VISUAL STRIP + CLOUD PROVIDER BAR ─── */}
        <div id="how-it-works" className="lfb-strip-wrapper">
          <div className="lfb-strip-header">
            <h2>3-Step Visual Strip</h2>
            <div className="lfb-cloud-bar">
              <span className="cloud-pill aws">aws</span>
              <span className="cloud-pill gcp">Google Cloud</span>
              <span className="cloud-pill azure">Azure</span>
              <span className="cloud-pill hf">🤗 Hugging Face</span>
            </div>
          </div>

          <div className="lfb-steps-grid">
            <div className="lfb-step-card step-cyan">
              <div className="step-num">1. Draw the Stack</div>
              <p>Select Frontend, Middleware Agents, and AI/Data nodes across AWS, GCP, Azure, and Hugging Face with custom flow wiring.</p>
            </div>
            <div className="lfb-step-card step-indigo">
              <div className="step-num">2. Run With Guardrails</div>
              <p>Auto-generate least-privilege IAM policies, SQL read-only checks, and Python Lambda handlers in an isolated sandbox.</p>
            </div>
            <div className="lfb-step-card step-emerald">
              <div className="step-num">3. Attach Verified Proof</div>
              <p>Every run produces a SHA-256 execution certificate and CloudWatch audit log signed off on your team Kanban board.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOLUTIONS: B2C VS B2B PERSONA SPLIT ─── */}
      <section id="solutions" className="lfb-section">
        <div className="lfb-container">
          <div className="lfb-section-head">
            <span className="lfb-eyebrow">BUILT FOR BUILDERS & ENTERPRISES</span>
            <h2>One Platform. Two High-Velocity Paths.</h2>
          </div>

          <div className="lfb-persona-grid">
            {/* B2C Card */}
            <div className="lfb-persona-card">
              <div className="persona-tag tag-cyan">For Individual Engineers & Builders</div>
              <h3>Build a Verified Multi-Cloud AI Portfolio</h3>
              <p>
                Stop relying on passive video courses. Architect real AI-ERP workflows, deploy live Python Lambdas, and graduate with tamper-evident SHA-256 proof certificates you can share with global recruiters.
              </p>
              <ul className="persona-list">
                <li>✓ Unlimited Solution Architecture diagrams & SVG exports</li>
                <li>✓ Browser Python simulator + live AWS/HF sandbox runs</li>
                <li>✓ Shareable verified portfolio links for LinkedIn & resumes</li>
              </ul>
              <button onClick={handleLaunchSandbox} className="lfb-btn-primary-glow full-w">
                Start Building Free ($0) →
              </button>
            </div>

            {/* B2B Card */}
            <div id="b2b-enterprise" className="lfb-persona-card card-b2b">
              <div className="persona-tag tag-emerald">For Engineering Teams, GCCs & Enterprises</div>
              <h3>Governed AI-ERP Sandbox & Technical Vetting</h3>
              <p>
                Prototype autonomous ERP agents safely before touching production databases. Enforce policy-as-code guardrails, audit bench readiness, and vet candidates on real multi-cloud builds.
              </p>
              <ul className="persona-list">
                <li>✓ Multi-tenant Kanban boards with role-based audit sign-offs</li>
                <li>✓ Deterministic SQL, PII, and spend guardrails on every agent</li>
                <li>✓ Bring-Your-Own-Cloud (BYOC) IAM deployment support</li>
              </ul>
              <button onClick={onSignIn} className="lfb-btn-signin full-w">
                Launch Enterprise Workspace →
              </button>
            </div>
          </div>

          {/* Vertical Industry Blueprints */}
          <div className="lfb-verticals-grid">
            <div className="vertical-card" onClick={() => (user ? navigate('/banking') : onSignIn())}>
              <span className="v-icon">🏦</span>
              <h4>Banking & Accounts Payable</h4>
              <p>Automated invoice OCR, discrepancy detection, and ledger audit trails.</p>
            </div>
            <div className="vertical-card" onClick={() => (user ? navigate('/supermarket') : onSignIn())}>
              <span className="v-icon">🛒</span>
              <h4>Retail & Inventory ERP</h4>
              <p>Demand forecasting and autonomous purchase order guardrails.</p>
            </div>
            <div className="vertical-card" onClick={() => (user ? navigate('/manufacturing') : onSignIn())}>
              <span className="v-icon">🏭</span>
              <h4>Manufacturing Supply Chain</h4>
              <p>Vendor SLA verification and real-time shipment anomaly routing.</p>
            </div>
            <div className="vertical-card" onClick={() => (user ? navigate('/fashion') : onSignIn())}>
              <span className="v-icon">👗</span>
              <h4>Enterprise RAG Copilot</h4>
              <p>Multi-cloud knowledge retrieval across S3, BigQuery, and OpenSearch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING & B2B PILOT INQUIRY ─── */}
      <section id="pricing" className="lfb-section lfb-pricing-bg">
        <div className="lfb-container">
          <div className="lfb-section-head">
            <span className="lfb-eyebrow">TRANSPARENT GLOBAL PRICING</span>
            <h2>Start Free. Scale With Verified Compute.</h2>
          </div>

          <div className="lfb-pricing-grid">
            <div className="price-card">
              <div className="price-tier">Free Sandbox</div>
              <div className="price-val">$0<span>/mo</span></div>
              <p className="price-desc">Ideal for designing architectures and testing logic locally.</p>
              <ul>
                <li>✓ Full 3-Tier Multi-Cloud Architect</li>
                <li>✓ Local Python & Lambda Simulator</li>
                <li>✓ 1 Active Kanban Project Board</li>
              </ul>
              <button onClick={handleLaunchSandbox} className="lfb-btn-secondary full-w">
                Open Free Sandbox
              </button>
            </div>

            <div className="price-card price-featured">
              <div className="price-badge">MOST POPULAR</div>
              <div className="price-tier">Pro Builder</div>
              <div className="price-val">$29<span>/mo</span></div>
              <p className="price-desc">For engineers shipping live multi-cloud AI portfolios.</p>
              <ul>
                <li>✓ Live AWS Lambda, Bedrock & Athena Runs</li>
                <li>✓ Hugging Face & Cross-Cloud Templates</li>
                <li>✓ Verified SHA-256 Portfolio Certificates</li>
              </ul>
              <button onClick={onSignIn} className="lfb-btn-primary-glow full-w">
                Get Pro Access
              </button>
            </div>

            <div className="price-card">
              <div className="price-tier">B2B Team & Enterprise</div>
              <div className="price-val">$49<span>/seat/mo</span></div>
              <p className="price-desc">For IT teams, GCCs, and hiring assessments.</p>
              <ul>
                <li>✓ Multi-Tenant Admin & Audit Dashboard</li>
                <li>✓ Custom Harness Guardrail Policies</li>
                <li>✓ Candidate Vetting & BYOC Cloud Roles</li>
              </ul>
              <a href="#b2b-contact" className="lfb-btn-signin full-w" style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                Book B2B Pilot
              </a>
            </div>
          </div>

          {/* Quick B2B Pilot Request Strip */}
          <div id="b2b-contact" className="lfb-b2b-box">
            <div>
              <h3>Request a 14-Day B2B Team Pilot or Custom AI-ERP Sprint</h3>
              <p>Onboard up to 15 engineers or test a custom multi-cloud workflow with full harness governance.</p>
            </div>
            {leadSubmitted ? (
              <div className="lfb-lead-success">
                ✓ Request received! Our architecture lead will reach out within 24 hours.
              </div>
            ) : (
              <form onSubmit={handleB2bDemoSubmit} className="lfb-b2b-form">
                <input
                  type="text"
                  placeholder="Company / Team Name"
                  value={b2bCompany}
                  onChange={(e) => setB2bCompany(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Work Email (you@company.com)"
                  value={b2bLeadEmail}
                  onChange={(e) => setB2bLeadEmail(e.target.value)}
                  required
                />
                <button type="submit" className="lfb-btn-primary-glow">
                  Request Pilot
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="lfb-footer">
        <div className="lfb-container lfb-footer-inner">
          <div className="lfb-brand">
            <div className="lfb-logo-icon">L</div>
            <span className="lfb-brand-text">LearnFromBest</span>
          </div>
          <p>© {new Date().getFullYear()} LearnFromBest • Multi-Cloud AI-ERP & Harness Engineering Platform</p>
        </div>
      </footer>
    </div>
  );
}