import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import DonorLogin from './pages/DonorLogin';
import HospitalLogin from './pages/HospitalLogin';
import DonorSignup from './pages/DonorSignup';
import HospitalSignup from './pages/HospitalSignup';
import DonorDashboard from './pages/donor/DonorDashboard';
import HospitalDashboard from './pages/hospital/HospitalDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/donor" element={<DonorLogin />} />
        <Route path="/login/hospital" element={<HospitalLogin />} />
        <Route path="/signup/donor" element={<DonorSignup />} />
        <Route path="/signup/hospital" element={<HospitalSignup />} />
        <Route path="/donor/*" element={<DonorDashboard />} />
        <Route path="/hospital/*" element={<HospitalDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
