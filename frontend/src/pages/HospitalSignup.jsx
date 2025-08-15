import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth-common.css';
import './HospitalSignup.css';

const HospitalSignup = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, isAuthenticated, getUserType } = useAuth();

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(formData, 'hospital');
      navigate('/hospital/info');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <h1 className="auth-title">Hospital Registration</h1>
          <p className="auth-subtitle">Join Blood Warriors as a hospital</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="id" className="form-label">
                Hospital ID *
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="form-input hospital"
                placeholder="Enter unique hospital ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Hospital Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input hospital"
                placeholder="Enter hospital name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input hospital"
              placeholder="Enter hospital email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input hospital"
              placeholder="Enter hospital phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input hospital"
              placeholder="Enter hospital address"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="latitude" className="form-label">
                Latitude *
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="form-input hospital"
                placeholder="Enter latitude"
                step="any"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="longitude" className="form-label">
                Longitude *
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="form-input hospital"
                placeholder="Enter longitude"
                step="any"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input hospital"
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input hospital"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`auth-button hospital ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-links">
          <span>Already have an account? </span>
          <Link to="/hospital/login" className="auth-link hospital">
            Sign In
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

export default HospitalSignup;
