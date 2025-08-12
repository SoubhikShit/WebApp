import React, { useState, useEffect } from 'react';
import './Hospital.css';

const BloodbanksList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/hospitals');
      if (!response.ok) {
        throw new Error('Failed to fetch hospitals');
      }
      const data = await response.json();
      setHospitals(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bloodbanks-container">
        <div className="bloodbanks-header">
          <h2>Hospital Network</h2>
          <p>Loading hospital information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bloodbanks-container">
        <div className="bloodbanks-header">
          <h2>Hospital Network</h2>
          <p>Error loading hospitals: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bloodbanks-container">
      <div className="bloodbanks-header">
        <h2>Hospital Network</h2>
        <p>Connect with our network of hospitals for collaboration and support</p>
      </div>

      <div className="bloodbanks-content">
        {hospitals.length === 0 ? (
          <div className="no-hospitals">
            <p>No hospitals available in the network.</p>
          </div>
        ) : (
          <div className="bloodbanks-grid">
            {hospitals.map((hospital) => (
              <div key={hospital._id} className="bloodbank-card">
                <div className="bank-header">
                  <h3>{hospital.name}</h3>
                  <span className="status-badge">
                    Available
                  </span>
                </div>
                
                <div className="bank-info">
                  <div className="info-row">
                    <label>Hospital ID:</label>
                    <span>{hospital.id}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>Location:</label>
                    <span>{hospital.address.city}, {hospital.address.state}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>Contact:</label>
                    <span>{hospital.phone}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>Email:</label>
                    <span>{hospital.email}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>Address:</label>
                    <span>
                      {hospital.address.street}, {hospital.address.city}, {hospital.address.state} {hospital.address.zipCode}
                    </span>
                  </div>
                </div>
                
                <div className="bank-actions">
                  <button className="contact-btn">
                    Contact Hospital
                  </button>
                  <button className="request-btn">
                    Request Support
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodbanksList;
