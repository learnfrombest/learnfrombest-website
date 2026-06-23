import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import ChatBot from './ChatBot';
import LandingAnimation from './LandingAnimation';

const WHATSAPP_NUMBER = '919567096415';
const WHATSAPP_MSG = encodeURIComponent("Hi! I'm interested in AI Tutoring Academy. Can you tell me more?");
const PAYPAL_URL = 'https://www.paypal.com/ncp/payment/B4RT88FQ5PAL8';

function LandingPage({ user, userEmail, onSignIn, onSignOut, onGoToDashboard }) {

  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const setRef = (id) => (el) => {
    sectionRefs.current[id] = el;
  };

  const features = [
    { icon: '🤖', title: 'AI-Powered Tutors', text: 'Get 1-on-1 sessions with specialised AI tutors trained on thousands of curriculum topics — available 24/7.' },
    { icon: '📊', title: 'Adaptive Learning', text: 'Our engine tracks your progress in real time and adjusts difficulty, pacing and content to keep you in the flow zone.' },
    { icon: '🎯', title: 'Job Guarantee', text: 'Land a ₹50K+ salary job or get a full refund. Our placement team works with you until you have an offer letter.' },
    { icon: '💬', title: 'Instant Feedback', text: 'Submit code, essays or assignments and receive detailed AI feedback within seconds — not days.' },
    { icon: '🌐', title: 'Industry Projects', text: 'Build real-world projects used by companies. Your portfolio will stand out in every interview.' },
    { icon: '📱', title: 'Certificate of Completion', text: 'Earn a verified certificate recognised by top employers across India and globally.' },
  ];

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
      ctaAction: 'whatsapp',
    },
    {
      id: 'pro',
      name: 'Job Assurance Pack',
      price: '$49',
      badge: '🔥 Best Value',
      highlight: true,
      features: [
        'Everything in Zero to Hero',
        '₹50K salary job guarantee',
        'Dedicated placement manager',
        'Unlimited 1:1 mentorship',
        'Live mock interviews',
        'Resume & LinkedIn review',
        'Priority WhatsApp support',
        'Lifetime access to all content',
      ],
      cta: 'Get Job Guaranteed →',
      ctaAction: 'paypal',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Now earning ₹65K/month at TCS',
      avatar: '👩‍💻',
      rating: 5,
      text: 'I went from zero coding knowledge to a ₹65K job in 4 months. The job guarantee kept me motivated and the mentors were incredible.',
    },
    {
      name: 'Arjun Mehta',
      role: 'Software Engineer at Infosys',
      avatar: '👨‍💼',
      rating: 5,
      text: 'The Job Assurance Pack paid for itself in the first week of my new salary. 100% worth every penny. Got placed in 3 months.',
    },
    {
      name: 'Sneha Patel',
      role: 'Data Analyst at Wipro',
      avatar: '🧑‍🎓',
      rating: 5,
      text: 'The certificate opened doors I never thought possible. 5 interview calls in the first week after completing the course.',
    },
    
  ];

  return (
    <div className="lp-root">

      {/* Intro animation — flies in from sky on first load */}
      <LandingAnimation />

      {/* Animated background particles */}
      <div className="lp-particles" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="lp-particle" style={{ '--i': i }} />
        ))}
      </div>

      {/* NAV */}
      <header className="lp-header">
        <div className="lp-logo">
          <span className="lp-logo-icon">🎓</span>
          AI Tutoring <span className="lp-logo-accent">Academy</span>
        </div>
        <nav className="lp-nav">
          <a href="#features" className="lp-nav-link">Features</a>
          <a href="#pricing" className="lp-nav-link">Pricing</a>
          <a href="#testimonials" className="lp-nav-link">Reviews</a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`} target="_blank" rel="noreferrer" className="lp-wa-nav-btn">
            💬 WhatsApp Us
          </a>
          {user ? (
            <>
              <button className="lp-btn-outline" onClick={onGoToDashboard}>Dashboard</button>
              <button className="lp-btn-primary" onClick={onSignOut}>Sign Out</button>
            </>
          ) : (
            <button className="lp-btn-primary" onClick={onSignIn}>Sign In</button>
          )}
        </nav>
      </header>

      {/* HERO */}
      <section className="lp-hero-wrap">

        {/* LEFT — Job locations */}
        <aside className="lp-hero-left">
          <div className="lp-locations-label">🌍 Jobs Waiting For You</div>
          <div className="lp-locations-list">
            {[
              { flag: '🇺🇸', city: 'New York', country: 'USA',       role: 'AI Engineer' },
              { flag: '🇺🇸', city: 'San Francisco', country: 'USA',  role: 'Data Scientist' },
              { flag: '🇺🇸', city: 'Seattle', country: 'USA',        role: 'ML Engineer' },
              { flag: '🇬🇧', city: 'London', country: 'UK',          role: 'Cloud Architect' },
              { flag: '🇬🇧', city: 'Manchester', country: 'UK',      role: 'DevOps Lead' },
              { flag: '🇨🇦', city: 'Toronto', country: 'Canada',     role: 'Full Stack Dev' },
              { flag: '🇨🇦', city: 'Vancouver', country: 'Canada',   role: 'Backend Engineer' },
              { flag: '🇦🇺', city: 'Sydney', country: 'Australia',   role: 'Product Manager' },
              { flag: '🇦🇺', city: 'Melbourne', country: 'Australia',role: 'Data Analyst' },
            ].map((loc, i) => (
              <div key={loc.city} className="lp-location-card" style={{ '--li': i }}>
                <span className="lp-location-flag">{loc.flag}</span>
                <div className="lp-location-info">
                  <div className="lp-location-city">{loc.city}, {loc.country}</div>
                  <div className="lp-location-role">{loc.role}</div>
                </div>
                <span className="lp-location-dot" />
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER — main hero */}
        <div className="lp-hero">
          <div className="lp-hero-badge">🚀 Trusted by 50,000+ learners across India</div>
          <h1 className="lp-hero-title">
            Land Your Dream Job with<br />
            <span className="lp-hero-highlight">AI-Powered Learning</span>
          </h1>
          <p className="lp-hero-sub">
            From $50,000 to $150,000/year salary — guaranteed. Our AI tutors, live mentors and placement team work until you get hired.
          </p>
          <div className="lp-hero-ctas">
            <button className="lp-btn-hero" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              View Plans →
            </button>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`} target="_blank" rel="noreferrer" className="lp-btn-wa-hero">
              💬 Chat on WhatsApp
            </a>
          </div>
          <div className="lp-hero-stats">
            {[['50K+', 'Active Learners'], ['₹50K+', 'Avg Salary'], ['98%', 'Placement Rate'], ['24/7', 'AI Support']].map(([val, label]) => (
              <div key={label} className="lp-stat">
                <div className="lp-stat-val">{val}</div>
                <div className="lp-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — learner photo grid */}
        <aside className="lp-hero-right">
          <div className="lp-photos-label">👩‍💻 Our Learners</div>
          <div className="lp-photo-grid">
            {[
              {
                url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=320&h=220&fit=crop&crop=faces',
                caption: 'Group learning session',
              },
              {
                url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=320&h=220&fit=crop&crop=faces',
                caption: 'Focused study time',
              },
              {
                url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=320&h=220&fit=crop&crop=faces',
                caption: 'Team project work',
              },
              {
                url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=320&h=220&fit=crop&crop=faces',
                caption: 'Live mentor session',
              },
            ].map((img, i) => (
              <div key={i} className="lp-photo-card" style={{ '--pi': i }}>
                <img src={img.url} alt={img.caption} className="lp-photo-img" loading="lazy" />
                <div className="lp-photo-caption">{img.caption}</div>
                <div className="lp-photo-shine" />
              </div>
            ))}
          </div>
          <div className="lp-photos-badge">🎓 Join 50,000+ learners</div>
        </aside>

      </section>

      {/* FEATURES */}
      <section
        id="features"
        className={`lp-section lp-animate ${visibleSections['features'] ? 'lp-visible' : ''}`}
        ref={setRef('features')}
      >
        <h2 className="lp-section-title">Why Learners Choose Us</h2>
        <p className="lp-section-sub">Everything you need to go from beginner to employed — in one platform.</p>
        <div className="lp-card-grid">
          {features.map((f, i) => (
            <div key={f.title} className="lp-card" style={{ '--delay': `${i * 0.1}s` }}>
              <div className="lp-card-icon">{f.icon}</div>
              <div className="lp-card-title">{f.title}</div>
              <div className="lp-card-text">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className={`lp-section lp-animate ${visibleSections['pricing'] ? 'lp-visible' : ''}`}
        ref={setRef('pricing')}
      >
        <h2 className="lp-section-title">Simple, Transparent Pricing</h2>
        <p className="lp-section-sub">Two plans. No hidden fees. Job guarantee or your money back.</p>
        <div className="lp-pricing-grid">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`lp-pricing-card ${plan.highlight ? 'lp-pricing-featured' : ''}`}
              style={{ '--delay': `${i * 0.15}s` }}
            >
              {plan.badge && <div className="lp-pricing-badge">{plan.badge}</div>}
              <div className="lp-pricing-name">{plan.name}</div>
              <div className="lp-pricing-price">{plan.price}</div>
              <ul className="lp-pricing-features">
                {plan.features.map((f) => (
                  <li key={f}><span className="lp-check">✓</span> {f}</li>
                ))}
              </ul>
              {plan.ctaAction === 'paypal' ? (
                <a href={PAYPAL_URL} target="_blank" rel="noreferrer" className="lp-btn-hero lp-plan-btn">
                  {plan.cta}
                </a>
              ) : (
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to start the FREE Zero to Hero Pack!')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="lp-btn-outline lp-plan-btn"
                >
                  {plan.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        className={`lp-section lp-animate ${visibleSections['testimonials'] ? 'lp-visible' : ''}`}
        ref={setRef('testimonials')}
      >
        <h2 className="lp-section-title">Real Results. Real People.</h2>
        <p className="lp-section-sub">Our students are getting hired every week. Here's what they say.</p>
        <div className="lp-testi-grid">
          {testimonials.map((t, i) => (
            <div key={t.name} className="lp-testi-card" style={{ '--delay': `${i * 0.1}s` }}>
              <div className="lp-testi-stars">{'★'.repeat(t.rating)}</div>
              <p className="lp-testi-text">"{t.text}"</p>
              <div className="lp-testi-author">
                <span className="lp-testi-avatar">{t.avatar}</span>
                <div>
                  <div className="lp-testi-name">{t.name}</div>
                  <div className="lp-testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHATSAPP BANNER */}
      <section className="lp-wa-banner">
        <div className="lp-wa-banner-inner">
          <div className="lp-wa-banner-text">
            <h2>Questions? We Reply in Minutes.</h2>
            <p>Our team is on WhatsApp 24/7 — ask about the job guarantee, curriculum, or payment.</p>
          </div>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`} target="_blank" rel="noreferrer" className="lp-btn-wa-large">
            <span>💬</span> Chat on WhatsApp Now
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <span>🎓</span> AI Tutoring <span className="lp-logo-accent">Academy</span>
          </div>
          <div className="lp-footer-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Reviews</a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">Contact</a>
          </div>
          <div className="lp-footer-copy">© 2026 AI Tutoring Academy. All rights reserved.</div>
        </div>
      </footer>

      {/* CHATBOT */}
      <ChatBot userEmail={userEmail} />

    </div>
  );
}

export default LandingPage;
