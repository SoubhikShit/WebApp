import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './pages/Home';
import DonorLogin from './pages/DonorLogin';
import HospitalLogin from './pages/HospitalLogin';
import DonorSignup from './pages/DonorSignup';
import HospitalSignup from './pages/HospitalSignup';
import DonorDashboard from './pages/donor/DonorDashboard';
import HospitalDashboard from './pages/hospital/HospitalDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedUserType }) => {
  const { isAuthenticated, getUserType, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (allowedUserType && getUserType() !== allowedUserType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/donor" element={<DonorLogin />} />
      <Route path="/login/hospital" element={<HospitalLogin />} />
      <Route path="/signup/donor" element={<DonorSignup />} />
      <Route path="/signup/hospital" element={<HospitalSignup />} />
      <Route 
        path="/donor/*" 
        element={
          <ProtectedRoute allowedUserType="donor">
            <DonorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hospital/*" 
        element={
          <ProtectedRoute allowedUserType="hospital">
            <HospitalDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
