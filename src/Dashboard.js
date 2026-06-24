import React from "react";
import "./Dashboard.css";

const PAYPAL_URL = 'https://www.paypal.com/ncp/payment/B4RT88FQ5PAL8';
const WHATSAPP_NUMBER = '919567096415';

function Dashboard() {

  const plans = [
    {
      id: 'free',
      name: 'Zero to Hero Pack',
      price: 'FREE',
      badge: 'Start Here',
      highlight: false,
      features: [
        'Full Zero to Hero curriculum',
        'AI-powered learning modules',
        'Progress dashboard',
        'Community Discord access',
        'Certificate of Completion',
        'Access to 50+ core subjects',
      ],
      cta: 'Get Free Access',
      ctaType: 'whatsapp',
    },
    {
      id: 'pro',
      name: 'Job Assurance Pack',
      price: '$49',
      badge: '🔥 Best Value',
      highlight: true,
      features: [
        'Everything in Zero to Hero',
        '₱50K salary job guarantee',
        'Dedicated placement manager',
        'Unlimited 1:1 mentorship',
        'Live mock interviews',
        'Resume & LinkedIn review',
        'Priority WhatsApp support',
        'Lifetime access to all content',
      ],
      cta: 'Get Job Guaranteed →',
      ctaType: 'paypal',
    },
  ];

  return (
    <div className="db-root">

      {/* Particles */}
      <div className="db-particles" aria-hidden="true">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="db-particle" style={{ '--i': i }} />
        ))}
      </div>

      <div className="db-content">
        <div className="db-hero">
          <div className="db-hero-badge">🚀 AI Use Case Marketplace</div>
          <h1 className="db-hero-title">Choose Your <span className="db-gold">Learning Plan</span></h1>
          <p className="db-hero-sub">
            Two plans. Zero hidden fees. Job guarantee or your money back.
          </p>
        </div>

        <div className="db-pricing-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`db-pricing-card ${plan.highlight ? 'db-featured' : ''}`}>
              {plan.badge && <div className="db-badge">{plan.badge}</div>}
              <div className="db-plan-name">{plan.name}</div>
              <div className="db-plan-price">{plan.price}</div>
              <ul className="db-plan-features">
                {plan.features.map((f) => (
                  <li key={f}><span className="db-check">✓</span> {f}</li>
                ))}
              </ul>
              {plan.ctaType === 'paypal' ? (
                <a href={PAYPAL_URL} target="_blank" rel="noreferrer" className="db-btn-gold">
                  {plan.cta}
                </a>
              ) : (
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to start the FREE Zero to Hero Pack!')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="db-btn-outline"
                >
                  {plan.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
