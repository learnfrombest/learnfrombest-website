import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

const ADMIN_EMAIL = 'mail.raghav.swaminathan@gmail.com';
const STORAGE_KEY = 'lfb_chat_leads';

function getLeads() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLead(name, phone) {
  const leads = getLeads();
  leads.push({ name, phone, submittedAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

// ── Chat step machine ────────────────────────────────────────────────
// steps: 'idle' → 'awaitName' → 'awaitPhone' → 'done'

export default function ChatBot({ userEmail }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState('idle');
  const [pendingName, setPendingName] = useState('');
  const [showLeads, setShowLeads] = useState(false);
  const [leads, setLeads] = useState([]);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const isAdmin = userEmail === ADMIN_EMAIL;

  // Stop pulsing after first open
  useEffect(() => {
    if (open) setPulse(false);
  }, [open]);

  // Greet on first open
  useEffect(() => {
    if (open && step === 'idle') {
      setMessages([
        {
          from: 'bot',
          text: "👋 Welcome to Learn From Best AI!\n\nIf you are new here, please share your **Name** and **Phone Number** and our executive will call you within 30 minutes.",
        },
        { from: 'bot', text: 'What is your name?' },
      ]);
      setStep('awaitName');
    }
  }, [open, step]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  function pushBot(text) {
    setMessages((prev) => [...prev, { from: 'bot', text }]);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { from: 'user', text: trimmed }]);
    setInput('');

    if (step === 'awaitName') {
      setPendingName(trimmed);
      setStep('awaitPhone');
      setTimeout(() => pushBot(`Nice to meet you, ${trimmed}! 😊\nWhat is your phone number?`), 400);
    } else if (step === 'awaitPhone') {
      // Basic phone validation — at least 7 digits
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length < 7) {
        setTimeout(() => pushBot('Please enter a valid phone number (at least 7 digits).'), 400);
        return;
      }
      saveLead(pendingName, trimmed);
      setStep('done');
      setTimeout(
        () =>
          pushBot(
            `Thank you, ${pendingName}! ✅\n\nOur executive will call you on **${trimmed}** within 30 minutes. Have a great day! 🚀`
          ),
        400
      );
    } else if (step === 'done') {
      setTimeout(() => pushBot("We've already saved your details. Our team will reach out soon! 😊"), 400);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function openLeads() {
    setLeads(getLeads());
    setShowLeads(true);
  }

  return (
    <>
      {/* ── Floating button ─────────────────────────────────────── */}
      <button
        className={`cb-fab ${pulse ? 'cb-fab-pulse' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
      >
        {open ? '✕' : '💬'}
        {!open && <span className="cb-fab-badge">1</span>}
      </button>

      {/* ── Admin leads button ───────────────────────────────────── */}
      {isAdmin && (
        <button className="cb-admin-btn" onClick={openLeads}>
          📋 View Leads
        </button>
      )}

      {/* ── Chat window ─────────────────────────────────────────── */}
      {open && (
        <div className="cb-window">
          <div className="cb-header">
            <span className="cb-header-avatar">🤖</span>
            <div className="cb-header-info">
              <div className="cb-header-name">Learn From Best AI</div>
              <div className="cb-header-status">● Online</div>
            </div>
            <button className="cb-close-btn" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="cb-messages">
            {messages.map((m, i) => (
              <div key={i} className={`cb-msg-wrap ${m.from === 'user' ? 'cb-msg-user' : 'cb-msg-bot'}`}>
                {m.from === 'bot' && <span className="cb-bot-avatar">🤖</span>}
                <div
                  className="cb-bubble"
                  dangerouslySetInnerHTML={{
                    __html: m.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>'),
                  }}
                />
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {step !== 'done' && (
            <div className="cb-input-row">
              <input
                ref={inputRef}
                className="cb-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={step === 'awaitPhone' ? 'Enter phone number…' : 'Type your name…'}
              />
              <button className="cb-send-btn" onClick={handleSend}>➤</button>
            </div>
          )}
        </div>
      )}

      {/* ── Admin leads modal ────────────────────────────────────── */}
      {showLeads && (
        <div className="cb-modal-overlay" onClick={() => setShowLeads(false)}>
          <div className="cb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cb-modal-header">
              <h3>📋 Lead Submissions</h3>
              <button className="cb-close-btn" onClick={() => setShowLeads(false)}>✕</button>
            </div>
            {leads.length === 0 ? (
              <p className="cb-modal-empty">No leads yet.</p>
            ) : (
              <table className="cb-leads-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{l.name}</td>
                      <td>{l.phone}</td>
                      <td>{new Date(l.submittedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
}
