import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DonorNavbar from '../../components/DonorNavbar';
import './DonorDashboard.css';

import Alerts from './Alerts';
import Profile from './Profile';

function DonorDashboard() {
  return (
    <div className="donor-dashboard">
      <DonorNavbar />
      <div className="dashboard-content">
        <Routes>
          <Route path="alerts" element={<Alerts />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Alerts />} />
        </Routes>
      </div>
    </div>
  );
}

export default DonorDashboard;
