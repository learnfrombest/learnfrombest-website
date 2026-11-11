import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EnterpriseDashboard({ onSignOut }) {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 70%)',
      color: '#fff',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Top Bar */}
      <header style={{
        width: '100%',
        maxWidth: '1100px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '60px'
      }}>
        <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px' }}>
          LearnFromBest
        </div>
        {onSignOut && (
          <button
            onClick={onSignOut}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#cbd5e1',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            ← Sign Out
          </button>
        )}
      </header>

      {/* Hero Headline */}
      <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '720px' }}>
        <h1 style={{
          fontSize: '42px',
          fontWeight: 800,
          margin: '0 0 16px',
          letterSpacing: '-1px'
        }}>
          Enterprise AI Studio
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#94a3b8',
          margin: 0,
          lineHeight: 1.6
        }}>
          Choose a path to begin training foundation models or build and test live production workloads.
        </p>
      </div>

      {/* 2 Primary Action Boxes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 420px))',
        gap: '28px',
        width: '100%',
        maxWidth: '920px',
        justifyContent: 'center'
      }}>
        {/* Box 1: Train AI */}
        <div
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px',
            padding: '36px 28px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#818cf8';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '28px',
              marginBottom: '20px'
            }}>
              🧠
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 10px' }}>
              Train AI
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Build domain datasets, fine-tune model parameters, configure RAG embeddings, and prompt test foundation LLMs.
            </p>
          </div>
          <div style={{
            marginTop: '28px',
            fontSize: '13px',
            color: '#a5b4fc',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            Open AI Training Studio →
          </div>
        </div>

        {/* Box 2: Work on Real Time Applications */}
        <div
          onClick={() => navigate('/workspace')}
          style={{
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '16px',
            padding: '36px 28px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#60a5fa';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '28px',
              marginBottom: '20px'
            }}>
              ⚡
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 10px' }}>
              Work on Real Time Applications
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Access live enterprise projects, manage backlog stories and Kanban boards, complete tasks, and attach verified execution proof.
            </p>
          </div>
          <div style={{
            marginTop: '28px',
            fontSize: '13px',
            color: '#93c5fd',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            Open Real-Time Workspace →
          </div>
        </div>
      </div>
    </div>
  );
}