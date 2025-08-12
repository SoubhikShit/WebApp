import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HospitalLogin.css';

const HospitalLogin = () => {
  const navigate = useNavigate();

  const [hospitalId, setHospitalId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Hospital Login:', { hospitalId, password });
    // TODO: Add real authentication logic here
    navigate('/hospital/dashboard');
  };

  return (
    <div className="hospital-login-container">
      <form className="hospital-login-form" onSubmit={handleSubmit}>
        <h2>Hospital Login</h2>

        <label>Hospital ID</label>
        <input
          type="text"
          value={hospitalId}
          onChange={(e) => setHospitalId(e.target.value)}
          placeholder="e.g., HOSP001"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <button type="submit">Login</button>

        <div className="login-actions">
          <button type="button" className="signup-link" onClick={() => navigate('/signup/hospital')}>
            Don't have an account? Sign up here
          </button>
          <button type="button" className="back-btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </form>
    </div>
  );
};

export default HospitalLogin;
