import ProjectStudio from './ProjectStudio';
import React, { useState, useEffect } from 'react';
import ReactPixel from 'react-facebook-pixel';
import './App.css';
import LandingPage from './LandingPage';
import BankingAutomation from './BankingAutomation';
import FashionAutomation from './FashionAutomation';
import SupermarketAutomation from './SupermarketAutomation';
import ManufacturingAutomation from './ManufacturingAutomation';

import {
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';

import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import EnterpriseDashboard from './EnterpriseDashboard';

// Amplify Imports
import { Amplify } from 'aws-amplify';
import { signOut } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';

import outputs from './amplify_outputs.json';
import { createUser } from './mutations.ts';
import { listUsers } from './queries.ts';

Amplify.configure(outputs);

const client = generateClient();
const adminEmail = 'mail.raghav.swaminathan@gmail.com';
const SUPERVISOR_NOTIFY_URL = process.env.REACT_APP_SUPERVISOR_NOTIFY_URL || '';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    ReactPixel.pageView();
  }, [location]);

  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [dbUsers, setDbUsers] = useState([]);

  const userEmail = user?.signInDetails?.loginId;

  async function handleSignOut() {
    try {
      await signOut();
      setUser(null);
      setCurrentPage('landing');
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }

  async function notifySupervisor(email, phone) {
    const loginAt = new Date().toISOString();
    if (!SUPERVISOR_NOTIFY_URL) return;

    try {
      await fetch(SUPERVISOR_NOTIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supervisorEmail: adminEmail,
          userEmail: email,
          userPhone: phone,
          loginAt
        })
      });
    } catch (err) {
      console.error('Failed to notify supervisor:', err);
    }
  }

  async function saveUserToDB(email) {
    try {
      const { data } = await client.graphql({ query: listUsers });
      const exists = data.listUsers.items.some((u) => u.email === email);

      if (!exists && email) {
        await client.graphql({
          query: createUser,
          variables: {
            input: {
              email: email,
              role: email === adminEmail ? 'expert' : 'professional'
            }
          }
        });
      }
    } catch (err) {
      console.error('Database error:', err);
    }
  }

  async function fetchAllUsers() {
    try {
      const response = await client.graphql({ query: listUsers });
      setDbUsers(response.data.listUsers.items);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  useEffect(() => {
    if (userEmail) {
      saveUserToDB(userEmail);
      if (userEmail === adminEmail) {
        fetchAllUsers();
      }
    }
  }, [userEmail]);

  const LandingPageWrapper = () => (
    <LandingPage
      user={user}
      userEmail={userEmail}
      onSignIn={() => setCurrentPage('auth')}
      onSignOut={handleSignOut}
      onGoToDashboard={() => navigate('/workspace')}
    />
  );

  return (
    <>
      {currentPage === 'auth' ? (
        <AuthPage
          onBack={() => setCurrentPage('landing')}
          onSignIn={(u, phone) => {
            setUser(u);
            setCurrentPage('landing');
            const email = u?.signInDetails?.loginId;
            notifySupervisor(email, phone);
            // Route directly to role selector / workspace
            navigate('/');
          }}
        />
      ) : (
        <Routes>
          <Route
            path="/workspace"
            element={
              user ? (
                <ProjectStudio
                  onSignOut={handleSignOut}
                  currentUserEmail={userEmail}
                />
              ) : (
                <LandingPageWrapper />
              )
            }
          />
          <Route
            path="/banking"
            element={user ? <BankingAutomation onSignOut={handleSignOut} /> : <LandingPageWrapper />}
          />
          <Route
            path="/fashion"
            element={user ? <FashionAutomation onSignOut={handleSignOut} /> : <LandingPageWrapper />}
          />
          <Route
            path="/supermarket"
            element={user ? <SupermarketAutomation onSignOut={handleSignOut} /> : <LandingPageWrapper />}
          />
          <Route
            path="/manufacturing"
            element={user ? <ManufacturingAutomation onSignOut={handleSignOut} /> : <LandingPageWrapper />}
          />

          {/* Root Route: Shows LandingPage when logged out; role gateway when logged in */}
          <Route
            path="/"
            element={
              user ? (
                <EnterpriseDashboard
                  onSignOut={handleSignOut}
                  userEmail={userEmail}
                  isAdmin={userEmail === adminEmail}
                />
              ) : (
                <LandingPageWrapper />
              )
            }
          />

          <Route path="/home" element={<LandingPageWrapper />} />

          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <LandingPageWrapper />}
          />
        </Routes>
      )}
    </>
  );
}

export default App;