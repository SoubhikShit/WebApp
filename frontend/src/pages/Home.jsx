import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

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
