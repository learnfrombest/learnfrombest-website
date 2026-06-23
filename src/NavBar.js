import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

export default function NavBar({ onSignOut, backPath = '/', backLabel = '← Back' }) {
  const navigate = useNavigate();
  return (
    <div className="nav-bar">
      <button className="nav-back-btn" onClick={() => navigate(backPath)}>
        {backLabel}
      </button>
      <button className="nav-signout-btn" onClick={onSignOut}>
        Sign Out
      </button>
    </div>
  );
}
