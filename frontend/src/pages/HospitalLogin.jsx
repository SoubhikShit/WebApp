import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth-common.css';
import './HospitalLogin.css';

const HospitalLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, getUserType } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      const userType = getUserType();
      if (userType === 'donor') {
        navigate('/donor/alerts');
      } else if (userType === 'hospital') {
        navigate('/hospital/info');
      }
    }
  }, [isAuthenticated, getUserType, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password, 'hospital');
      navigate('/hospital/info');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated()) {
    return <div className="auth-container">Redirecting...</div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo hospital-logo">
            🏥
          </div>
          <h1 className="auth-title">Hospital Login</h1>
          <p className="auth-subtitle">Welcome back! Sign in to your hospital account</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input hospital"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input hospital"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className={`auth-button hospital ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-links">
          <span>Don't have an account? </span>
          <Link to="/hospital/signup" className="auth-link hospital">
            Sign Up
          </Link>
          <br />
          <Link to="/" className="auth-link hospital">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HospitalLogin;
