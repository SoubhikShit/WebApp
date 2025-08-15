import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getUserType } = useAuth();

  const userType = getUserType();

  // If user is already logged in, show dashboard options
  if (isAuthenticated()) {
    return (
      <div className="home-container">
        <div className="content">
          <h1>Blood Warriors</h1>
          <p>
            Welcome back to BloodWarriors! You're already logged in.
          </p>

          <div className="dashboard-options">
            {userType === 'donor' ? (
              <div className="dashboard-section">
                <h3>Donor Dashboard</h3>
                <p>Manage your profile and view blood donation alerts</p>
                <button 
                  onClick={() => navigate('/donor/alerts')} 
                  className="dashboard-btn donor-dashboard-btn"
                >
                  Go to Donor Dashboard
                </button>
                <button 
                  onClick={() => navigate('/donor/profile')} 
                  className="dashboard-btn profile-btn"
                >
                  View Profile
                </button>
              </div>
            ) : (
              <div className="dashboard-section">
                <h3>Hospital Dashboard</h3>
                <p>Manage blood requests and hospital information</p>
                <button 
                  onClick={() => navigate('/hospital/info')} 
                  className="dashboard-btn hospital-dashboard-btn"
                >
                  Go to Hospital Dashboard
                </button>
                <button 
                  onClick={() => navigate('/hospital/blooddata')} 
                  className="dashboard-btn blood-data-btn"
                >
                  Manage Blood Data
                </button>
              </div>
            )}
            
            <div className="logout-section">
              <button 
                onClick={() => {
                  // This will trigger logout and redirect to home
                  window.location.reload();
                }} 
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default home page for non-authenticated users
  return (
    <div className="home-container">
      <div className="content">
        <h1>Blood Warriors</h1>
        <p>
          Welcome to BloodWarriors - Your trusted platform for blood donation and hospital management.
          Every drop counts and your contribution can help save lives. Join our mission to ensure 
          safe and sufficient blood supply for those in urgent need.
        </p>

        <p>
          Choose your role below to get started with our blood donation platform.
        </p>

        <div className="buttons">
          <div className="button-group">
            <h3>Donor</h3>
            <button onClick={() => navigate('/signup/donor')} className="donor-signup-btn">
              New Donor Signup
            </button>
            <button onClick={() => navigate('/login/donor')} className="donor-login-btn">
              Existing Donor Login
            </button>
          </div>
          
          <div className="button-group">
            <h3>Hospital</h3>
            <button onClick={() => navigate('/signup/hospital')} className="hospital-signup-btn">
              New Hospital Signup
            </button>
            <button onClick={() => navigate('/login/hospital')} className="hospital-login-btn">
              Existing Hospital Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
