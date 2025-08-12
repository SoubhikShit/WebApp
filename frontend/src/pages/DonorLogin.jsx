import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonorLogin.css';

const DonorLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log inputs and navigate to donor dashboard
    console.log('Donor Login:', { email, password });
    // TODO: Add real authentication logic here
    navigate('/donor/dashboard');
  };

  return (
    <div className="donor-login-container">
      <form className="donor-login-form" onSubmit={handleSubmit}>
        <h2>Donor Login</h2>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
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
          <button type="button" className="signup-link" onClick={() => navigate('/signup/donor')}>
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

export default DonorLogin;
