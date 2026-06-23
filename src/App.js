import React, { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './LandingPage';
import BankingAutomation
from "./BankingAutomation";
import FashionAutomation 
from "./FashionAutomation";
import SupermarketAutomation
from "./SupermarketAutomation";
import ManufacturingAutomation
from "./ManufacturingAutomation";

import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import AuthPage from './AuthPage';
import Dashboard from "./Dashboard";
import EnterpriseDashboard from "./EnterpriseDashboard";

// Amplify Imports
import { Amplify } from "aws-amplify";
import { signOut } from 'aws-amplify/auth';
import { generateClient } from "aws-amplify/api";

import outputs from "./amplify_outputs.json";

import { createUser } from "./mutations.ts";
import { listUsers } from "./queries.ts";

Amplify.configure(outputs);

const client = generateClient();

const adminEmail =
  "mail.raghav.swaminathan@gmail.com";

// ── Configure your supervisor notification endpoint here ──────────────────────
// Replace with your actual backend URL (e.g. AWS API Gateway + SES Lambda).
// The endpoint should accept POST with JSON body: { email, phone, loginAt }.
const SUPERVISOR_NOTIFY_URL = process.env.REACT_APP_SUPERVISOR_NOTIFY_URL || '';

function App() {

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] =
    useState('landing');

  const [user, setUser] =
    useState(null);

  const [dbUsers, setDbUsers] =
    useState([]);

  const userEmail =
    user?.signInDetails?.loginId;

  // =====================================
  // SIGN OUT
  // =====================================

  async function handleSignOut() {

    try {

      await signOut();

      setUser(null);

      setCurrentPage('landing');

      navigate("/");

    } catch (error) {

      console.error(
        'Error signing out: ',
        error
      );
    }
  }

  // =====================================
  // NOTIFY SUPERVISOR
  // =====================================

  async function notifySupervisor(email, phone) {
    const loginAt = new Date().toISOString();
    const payload = { email, phone, loginAt };

    console.info('[Login Event] Supervisor notification:', payload);

    if (!SUPERVISOR_NOTIFY_URL) {
      console.warn(
        'REACT_APP_SUPERVISOR_NOTIFY_URL is not set. ' +
        'Set it to your notification endpoint to enable email alerts.'
      );
      return;
    }

    try {
      await fetch(SUPERVISOR_NOTIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supervisorEmail: adminEmail,
          userEmail: email,
          userPhone: phone,
          loginAt,
        }),
      });
    } catch (err) {
      console.error('Failed to notify supervisor:', err);
    }
  }

  // =====================================
  // SAVE USER
  // =====================================

  async function saveUserToDB(email) {

    try {

      const { data } =
        await client.graphql({
          query: listUsers
        });

      const exists =
        data.listUsers.items.some(
          (u) => u.email === email
        );

      if (!exists && email) {

        await client.graphql({

          query: createUser,

          variables: {

            input: {

              email: email,

              role:
                email === adminEmail
                  ? "expert"
                  : "professional"
            }
          }
        });
      }

    } catch (err) {

      console.error(
        "Database error:",
        err
      );
    }
  }

  // =====================================
  // FETCH USERS
  // =====================================

  async function fetchAllUsers() {

    try {

      const response =
        await client.graphql({
          query: listUsers
        });

      setDbUsers(
        response.data.listUsers.items
      );

    } catch (err) {

      console.error(
        "Fetch error:",
        err
      );
    }
  }

  // =====================================
  // USE EFFECT
  // =====================================

  useEffect(() => {

    if (userEmail) {

      saveUserToDB(userEmail);

      if (userEmail === adminEmail) {

        fetchAllUsers();
      }
    }

  }, [userEmail]);

  // =====================================
  // LANDING PAGE WRAPPER
  // =====================================

  const LandingPageWrapper = () => (
    <LandingPage
      user={user}
      userEmail={userEmail}
      onSignIn={() => setCurrentPage('auth')}
      onSignOut={handleSignOut}
      onGoToDashboard={() => navigate('/')}
    />
  );

  return (

    <>

      {currentPage === 'auth' ? (

        <AuthPage

          onBack={() =>
            setCurrentPage('landing')
          }

          onSignIn={(u, phone) => {

            setUser(u);

            setCurrentPage('landing');

            navigate("/");

            const email = u?.signInDetails?.loginId;
            notifySupervisor(email, phone);
          }}

        />

      ) : (

        <Routes>
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
          {/* Enterprise Dashboard — admin sees Landing (chatbot leads), others see marketplace */}
          <Route
            path="/"
            element={
              user
                ? userEmail === adminEmail
                  ? <LandingPageWrapper />
                  : <EnterpriseDashboard onSignOut={handleSignOut} />
                : <LandingPageWrapper />
            }
          />

          {/* Subscription Dashboard */}
          <Route
            path="/dashboard"
            element={
              user
                ? <Dashboard />
                : <LandingPageWrapper />
            }
          />

        </Routes>

      )}

    </>

  );
}

export default App;