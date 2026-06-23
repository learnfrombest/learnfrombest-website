import React, { useState, useEffect } from 'react';
import './LandingAnimation.css';

// phases: walking → arrived → talking → pointing → done
const PHASES = [
  { name: 'walking',  at: 0    },
  { name: 'arrived',  at: 3000 },
  { name: 'talking',  at: 4500 },
  { name: 'pointing', at: 9500 },
  { name: 'done',     at: 12000 },
];

export default function LandingAnimation() {
  const [phase, setPhase] = useState('walking');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timers = PHASES.slice(1).map(({ name, at }) =>
      setTimeout(() => setPhase(name), at)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  if (dismissed || phase === 'done') return null;

  return (
    <div
      className={`la-overlay ${phase === 'pointing' ? 'la-overlay-pointing' : ''}`}
      onClick={() => setDismissed(true)}
    >
      {/* Dark cinematic backdrop */}
      <div className="la-backdrop" />

      {/* Subtle floor grid (perspective) */}
      <div className="la-floor" />

      {/* ── Character ────────────────────────────────────────── */}
      <div className={`la-character la-character-${phase}`}>

        {/* Shadow on floor */}
        <div className="la-shadow" />

        {/* Briefcase — held on right side */}
        <div className={`la-briefcase ${phase === 'pointing' ? 'la-briefcase-down' : ''}`}>💼</div>

        {/* Body */}
        <div className="la-suit">🤵</div>

        {/* Pointing arm overlay — only in pointing phase */}
        {phase === 'pointing' && (
          <div className="la-point-arm">👉</div>
        )}
      </div>

      {/* ── Speech bubble ────────────────────────────────────── */}
      {(phase === 'talking' || phase === 'pointing') && (
        <div className={`la-bubble ${phase === 'pointing' ? 'la-bubble-shift' : ''}`}>
          {phase === 'talking' ? (
            <>
              <p className="la-line1">Are you looking for an <strong>AI job?</strong></p>
              <p className="la-line2">
                Use the <span className="la-hl">💬 chat</span> in the bottom‑right corner —
                share your details and <strong>we will call you in 30 minutes!</strong>
              </p>
            </>
          ) : (
            <p className="la-line1 la-point-msg">
              👇 Tap the chat button — let's get you hired! 🚀
            </p>
          )}
          <span className="la-tail" />
        </div>
      )}

      {/* ── Pointing arrow to chatbot ────────────────────────── */}
      {phase === 'pointing' && (
        <div className="la-arrow-wrap">
          <div className="la-arrow-shaft" />
          <div className="la-arrow-head" />
          <div className="la-chatbot-glow" />
        </div>
      )}

      <div className="la-skip">tap anywhere to skip</div>
    </div>
  );
}
