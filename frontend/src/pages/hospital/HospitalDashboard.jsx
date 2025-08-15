import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HospitalNavbar from '../../components/HospitalNavbar';
import './Hospital.css';

import Info from './Info';
import BloodData from './BloodData';
import BloodbanksList from './BloodbanksList';
import Responses from './Responses';

function HospitalDashboard() {
  return (
    <div className="hospital-dashboard">
      <HospitalNavbar />
      <div className="dashboard-content">
        <Routes>
          <Route path="info" element={<Info />} />
          <Route path="blooddata" element={<BloodData />} />
          <Route path="bloodbanks" element={<BloodbanksList />} />
          <Route path="responses" element={<Responses />} />
          <Route path="*" element={<Info />} />
        </Routes>
      </div>
    </div>
  );
}

export default HospitalDashboard;
