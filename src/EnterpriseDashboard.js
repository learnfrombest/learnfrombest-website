import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EnterpriseDashboard({ onSignOut, userEmail, isAdmin }) {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 20% 15%, rgba(56, 189, 248, 0.12), transparent 40%), #060b16',
      color: '#f8fafc',
      padding: '36px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Top Bar */}
      <header style={{
        width: '100%',
        maxWidth: '1060px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '52px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #4f46e5, #38bdf8)',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 900
          }}>
            L
          </div>
          <span style={{ fontWeight: 800, fontSize: '17px' }}>LearnFromBest</span>
          <span style={{
            fontSize: '11px',
            background: 'rgba(56, 189, 248, 0.12)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '2px 8px',
            borderRadius: '6px',
            fontWeight: 700
          }}>
            AI-ERP STUDIO
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {userEmail && (
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{userEmail}</span>
          )}
          <button
            onClick={() => navigate('/home')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              color: '#cbd5e1',
              padding: '7px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Home
          </button>
          {onSignOut && (
            <button
              onClick={onSignOut}
              style={{
                background: 'rgba(239, 68, 68, 0.14)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5',
                padding: '7px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* Hero Headline */}
      <div style={{ textAlign: 'center', marginBottom: '44px', maxWidth: '720px' }}>
        <h1 style={{ fontSize: '38px', fontWeight: 800, margin: '0 0 14px', letterSpacing: '-0.8px' }}>
          Choose Your <span style={{ color: '#38bdf8' }}>Workspace Mode</span>
        </h1>
        <p style={{ fontSize: '15px', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
          Design governed multi-cloud AI-ERP pipelines, execute sandboxed Python agents, and generate SHA-256 verified proof artifacts.
        </p>
      </div>

      {/* 2 Primary Path Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 440px))',
        gap: '24px',
        width: '100%',
        maxWidth: '940px',
        justifyContent: 'center'
      }}>
        {/* Path 1: AI-ERP Real-Time Workspace (B2B + Builder) */}
        <div
          onClick={() => navigate('/workspace')}
          style={{
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, #0c1426 100%)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '16px',
            padding: '32px 28px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 14px 34px rgba(0,0,0,0.4)'
          }}
        >
          <div style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 700,
            color: '#34d399',
            background: 'rgba(16, 185, 129, 0.15)',
            padding: '3px 9px',
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            B2B ENTERPRISE & PROOF ENGINE
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 10px' }}>
            AI-ERP Project & Agent Studio
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 24px' }}>
            Manage enterprise Kanban boards, wire multi-cloud Solution Architectures, deploy sandboxed Python Lambdas, and sign off verified execution proofs.
          </p>
          <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 700 }}>
            Enter AI-ERP Workspace →
          </div>
        </div>

        {/* Path 2: Train AI & Foundation Models (B2C / Labs) */}
        <div
          onClick={() => navigate('/dashboard')}
          style={{
            background: '#0c1426',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '16px',
            padding: '32px 28px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 14px 34px rgba(0,0,0,0.4)'
          }}
        >
          <div style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 700,
            color: '#a5b4fc',
            background: 'rgba(99, 102, 241, 0.15)',
            padding: '3px 9px',
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            MODEL LABS & VERTICAL TEMPLATES
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 10px' }}>
            Train AI & Vertical Automations
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 24px' }}>
            Configure RAG datasets, test Hugging Face and Bedrock prompts, and explore pre-built Banking, Retail, and Manufacturing automation suites.
          </p>
          <div style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: 700 }}>
            Open Model & Automation Labs →
          </div>
        </div>
      </div>

      {/* Direct Studio Shortcuts */}
      <div style={{
        marginTop: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'center'
      }}>
        <a
          href="/architecture_builder.html"
          target="_blank"
          rel="noreferrer"
          style={{
            background: '#0c1426',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          ❖ Direct: Solution Architecture Builder
        </a>
        <a
          href="/lambda_studio.html"
          target="_blank"
          rel="noreferrer"
          style={{
            background: '#0c1426',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            color: '#a5b4fc',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          🐍 Direct: Python & AWS Lambda Studio
        </a>
        {isAdmin && (
          <span style={{
            alignSelf: 'center',
            fontSize: '12px',
            color: '#34d399',
            fontWeight: 700,
            padding: '0 8px'
          }}>
            ★ Admin Mode Active
          </span>
        )}
      </div>
    </div>
  );
}