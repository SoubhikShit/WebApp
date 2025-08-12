import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    // You can clear auth here, then redirect to home/login
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate('/')}>
        Blood Warriors
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/donor" className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/donor/alerts" className={({ isActive }) => (isActive ? 'active' : '')}>
            Alerts / Donate
          </NavLink>
        </li>
        <li>
          <NavLink to="/donor/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
            Profile
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
