import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Hospital.css';

const Info = () => {
  const { user } = useAuth();
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setHospitalData(user);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="hospital-info-loading">Loading hospital information...</div>;
  }

  if (!hospitalData) {
    return <div className="hospital-info-error">No hospital data available</div>;
  }

  return (
    <div className="hospital-info-container">
      <div className="hospital-info-header">
        <h2>Hospital Information</h2>
        <p>Your hospital details and contact information</p>
      </div>
      
      <div className="hospital-info-content">
        <div className="info-section">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Hospital ID:</label>
              <span>{hospitalData.id}</span>
            </div>
            <div className="info-item">
              <label>Hospital Name:</label>
              <span>{hospitalData.name}</span>
            </div>
          </div>
        </div>
        
        <div className="info-section">
          <h3>Contact Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Email:</label>
              <span>{hospitalData.email}</span>
            </div>
            <div className="info-item">
              <label>Phone:</label>
              <span>{hospitalData.phone}</span>
            </div>
          </div>
        </div>
        
        <div className="info-section">
          <h3>Address</h3>
          <div className="info-grid">
            <div className="info-item full-width">
              <label>Street Address:</label>
              <span>{hospitalData.address.street}</span>
            </div>
            <div className="info-item">
              <label>City:</label>
              <span>{hospitalData.address.city}</span>
            </div>
            <div className="info-item">
              <label>State:</label>
              <span>{hospitalData.address.state}</span>
            </div>
            <div className="info-item">
              <label>ZIP Code:</label>
              <span>{hospitalData.address.zipCode}</span>
            </div>
          </div>
        </div>
        
        <div className="info-section">
          <h3>Location Coordinates</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Latitude:</label>
              <span>{hospitalData.latitude}</span>
            </div>
            <div className="info-item">
              <label>Longitude:</label>
              <span>{hospitalData.longitude}</span>
            </div>
          </div>
        </div>
        
        <div className="info-section">
          <h3>Account Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Member Since:</label>
              <span>{new Date(hospitalData.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Last Updated:</label>
              <span>{new Date(hospitalData.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
