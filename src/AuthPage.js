import React, { useState } from 'react';
import {
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
  resendSignUpCode,
} from 'aws-amplify/auth';
import './AuthPage.css';

function AuthPage({ onBack, onSignIn }) {

  // tab: 'signin' | 'signup'
  const [tab, setTab] = useState('signin');

  // stage: 'form' | 'verify' | 'forgot' | 'reset'
  const [stage, setStage] = useState('form');

  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [code, setCode]         = useState('');
  const [newPass, setNewPass]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [info, setInfo]         = useState('');
  const [loading, setLoading]   = useState(false);

  const clear = () => { setError(''); setInfo(''); };

  // ── SIGN IN ───────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    clear();
    if (!email || !phone || !password) { setError('Please fill in all fields.'); return; }
    if (!/^\+?[1-9]\d{6,14}$/.test(phone.replace(/[\s\-()]/g, ''))) {
      setError('Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    try {
      try { await signOut(); } catch (_) {}
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        setStage('verify');
        setInfo('Your account needs verification. Check your email for a code.');
      } else if (isSignedIn) {
        // Re-fetch the current user via getCurrentUser to pass up
        const { getCurrentUser } = await import('aws-amplify/auth');
        const user = await getCurrentUser();
        onSignIn(user, phone);
      }
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── SIGN UP ───────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    clear();
    if (!email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      setStage('verify');
      setInfo('Account created! Check your email for a verification code.');
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── CONFIRM SIGN UP ───────────────────────────────────
  const handleConfirm = async (e) => {
    e.preventDefault();
    clear();
    if (!code) { setError('Please enter the verification code.'); return; }
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      try { await signOut(); } catch (_) {}
      const { isSignedIn } = await signIn({ username: email, password });
      if (isSignedIn) {
        const { getCurrentUser } = await import('aws-amplify/auth');
        const user = await getCurrentUser();
        onSignIn(user);
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    clear();
    try {
      await resendSignUpCode({ username: email });
      setInfo('A new code has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Could not resend code.');
    }
  };

  // ── FORGOT PASSWORD ───────────────────────────────────
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    clear();
    if (!email) { setError('Please enter your email first.'); return; }
    setLoading(true);
    try {
      await resetPassword({ username: email });
      setStage('reset');
      setInfo('Reset code sent to your email.');
    } catch (err) {
      setError(err.message || 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetConfirm = async (e) => {
    e.preventDefault();
    clear();
    if (!code || !newPass) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword: newPass });
      setStage('form');
      setTab('signin');
      setInfo('Password reset! Please sign in with your new password.');
    } catch (err) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  // ── SWITCH TAB ────────────────────────────────────────
  const switchTab = (t) => {
    setTab(t);
    setStage('form');
    clear();
  };

  // ── RENDER ────────────────────────────────────────────
  return (
    <div className="auth-root">

      {/* Particles */}
      <div className="auth-particles" aria-hidden="true">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="auth-particle" style={{ '--i': i }} />
        ))}
      </div>

      {/* Back button */}
      <button className="auth-back-btn" onClick={onBack}>← Back to Home</button>

      {/* Card */}
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo-icon">🎓</span>
          <span className="auth-logo-text">
            AI Tutoring <span className="auth-logo-accent">Academy</span>
          </span>
        </div>

        {/* ── VERIFY STAGE ── */}
        {stage === 'verify' && (
          <div className="auth-stage">
            <div className="auth-stage-icon">📧</div>
            <h2 className="auth-stage-title">Check Your Email</h2>
            <p className="auth-stage-sub">We sent a 6-digit verification code to <strong>{email}</strong></p>
            {info  && <div className="auth-info">{info}</div>}
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleConfirm} className="auth-form">
              <div className="auth-field">
                <label>Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="auth-input auth-input-center"
                  autoFocus
                />
              </div>
              <button className="auth-btn-primary" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : 'Verify & Sign In'}
              </button>
            </form>
            <button className="auth-link-btn" onClick={handleResend}>Resend code</button>
          </div>
        )}

        {/* ── FORGOT STAGE ── */}
        {stage === 'forgot' && (
          <div className="auth-stage">
            <div className="auth-stage-icon">🔑</div>
            <h2 className="auth-stage-title">Reset Password</h2>
            <p className="auth-stage-sub">Enter your email and we'll send a reset code.</p>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleForgotRequest} className="auth-form">
              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="auth-input"
                  autoFocus
                />
              </div>
              <button className="auth-btn-primary" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : 'Send Reset Code'}
              </button>
            </form>
            <button className="auth-link-btn" onClick={() => { setStage('form'); clear(); }}>← Back to Sign In</button>
          </div>
        )}

        {/* ── RESET STAGE ── */}
        {stage === 'reset' && (
          <div className="auth-stage">
            <div className="auth-stage-icon">🔒</div>
            <h2 className="auth-stage-title">Enter New Password</h2>
            {info  && <div className="auth-info">{info}</div>}
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleResetConfirm} className="auth-form">
              <div className="auth-field">
                <label>Reset Code</label>
                <input
                  type="text"
                  placeholder="6-digit code from email"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="auth-input"
                />
              </div>
              <div className="auth-field">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Min 8 chars, upper, number, symbol"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="auth-input"
                />
              </div>
              <button className="auth-btn-primary" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : 'Set New Password'}
              </button>
            </form>
          </div>
        )}

        {/* ── MAIN FORM ── */}
        {stage === 'form' && (
          <>
            {/* Tabs */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${tab === 'signin' ? 'auth-tab-active' : ''}`}
                onClick={() => switchTab('signin')}
              >
                Sign In
              </button>
              <button
                className={`auth-tab ${tab === 'signup' ? 'auth-tab-active' : ''}`}
                onClick={() => switchTab('signup')}
              >
                Create Account
              </button>
              <div className={`auth-tab-indicator ${tab === 'signup' ? 'auth-tab-indicator-right' : ''}`} />
            </div>

            {info  && <div className="auth-info">{info}</div>}
            {error && <div className="auth-error">{error}</div>}

            {/* Sign In Form */}
            {tab === 'signin' && (
              <form onSubmit={handleSignIn} className="auth-form">
                <div className="auth-field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="auth-input"
                    autoComplete="email"
                  />
                </div>
                <div className="auth-field">
                  <label>Phone Number <span style={{ color: '#e74c3c' }}>*</span></label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 555 000 0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="auth-input"
                    autoComplete="tel"
                    required
                  />
                </div>
                <div className="auth-field">
                  <label>Password</label>
                  <div className="auth-pass-wrap">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="auth-input"
                      autoComplete="current-password"
                    />
                    <button type="button" className="auth-eye" onClick={() => setShowPass(s => !s)}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <button className="auth-btn-primary" disabled={loading}>
                  {loading ? <span className="auth-spinner" /> : 'Sign In →'}
                </button>
                <button type="button" className="auth-link-btn" onClick={() => { setStage('forgot'); clear(); }}>
                  Forgot your password?
                </button>
              </form>
            )}

            {/* Sign Up Form */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUp} className="auth-form">
                <div className="auth-field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="auth-input"
                    autoComplete="email"
                  />
                </div>
                <div className="auth-field">
                  <label>Password</label>
                  <div className="auth-pass-wrap">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Min 8 chars, upper, number, symbol"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="auth-input"
                      autoComplete="new-password"
                    />
                    <button type="button" className="auth-eye" onClick={() => setShowPass(s => !s)}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div className="auth-field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="auth-input"
                    autoComplete="new-password"
                  />
                </div>
                <div className="auth-password-rules">
                  <span className={password.length >= 8 ? 'rule-ok' : 'rule'}>✓ 8+ characters</span>
                  <span className={/[A-Z]/.test(password) ? 'rule-ok' : 'rule'}>✓ Uppercase</span>
                  <span className={/[0-9]/.test(password) ? 'rule-ok' : 'rule'}>✓ Number</span>
                  <span className={/[^A-Za-z0-9]/.test(password) ? 'rule-ok' : 'rule'}>✓ Symbol</span>
                </div>
                <button className="auth-btn-primary" disabled={loading}>
                  {loading ? <span className="auth-spinner" /> : 'Create Account →'}
                </button>
              </form>
            )}
          </>
        )}

        <div className="auth-footer-note">
          Secured by AWS Cognito · 🔒 End-to-end encrypted
        </div>

      </div>
    </div>
  );
}

export default AuthPage;
