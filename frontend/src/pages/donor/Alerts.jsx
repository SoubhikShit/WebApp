import React, { useState, useEffect } from 'react';
import './Alerts.css';

const Alerts = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/requests');
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Emergency': return 'var(--danger-color)';
      case 'High': return 'var(--warning-color)';
      case 'Medium': return 'var(--success-color)';
      case 'Low': return 'var(--text-secondary)';
      default: return 'var(--text-secondary)';
    }
  };

  if (loading) {
    return (
      <div className="alerts-container">
        <div className="alerts-header">
          <h2>Hospital Blood Alerts</h2>
          <p>Loading blood donation requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alerts-container">
        <div className="alerts-header">
          <h2>Hospital Blood Alerts</h2>
          <p>Error loading requests: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h2>Hospital Blood Alerts</h2>
        <p>Stay updated with urgent blood donation requests from hospitals</p>
      </div>
      
      {requests.length === 0 ? (
        <div className="no-requests">
          <p>No blood requests available at the moment.</p>
        </div>
      ) : (
        <div className="alerts-grid">
          {requests.map((request) => (
            <div key={request._id} className="alert-card">
              <div className="alert-header">
                <h3>Blood Request #{request.id}</h3>
                <span 
                  className="urgency-badge"
                  style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                >
                  {request.urgency}
                </span>
              </div>
              
              <div className="blood-type-badge">
                Blood Type: {request.bloodGroup}
              </div>
              
              <p className="alert-message">{request.message}</p>
              
              <div className="alert-footer">
                <span className="quantity">Quantity Needed: {request.quantity} units</span>
                <span className="timestamp">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <button className="respond-btn">
                Respond to Alert
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
