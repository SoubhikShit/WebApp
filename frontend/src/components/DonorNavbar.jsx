import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DonorNavbar.css';

const DonorNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="donor-navbar">
      <div className="nav-brand">
        <span className="brand-icon">Blood Warriors</span>
        <span className="brand-text">Donor Dashboard</span>
      </div>
      
      <div className="nav-links">
        <button 
          className={`nav-link ${isActive('/donor/alerts')}`}
          onClick={() => navigate('/donor/alerts')}
        >
          Alerts
        </button>
        <button 
          className={`nav-link ${isActive('/donor/profile')}`}
          onClick={() => navigate('/donor/profile')}
        >
          Profile
        </button>
      </div>
      
      <div className="nav-actions">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default DonorNavbar;
