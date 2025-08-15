import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Alerts.css';

const Alerts = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.bloodGroup && user.latitude && user.longitude) { // Fetch requests only if user and their profile location are available
      fetchRequestsByBloodGroup(user.bloodGroup, user.latitude, user.longitude);
    } else if (user && user.bloodGroup && (!user.latitude || !user.longitude)) {
      setError('Your profile location (latitude/longitude) is missing. Distance filtering cannot be applied.');
      setLoading(false);
    }
  }, [user]); // Re-run when user object changes

  const fetchRequestsByBloodGroup = async (bloodGroup, lat, lng, maxDistance = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construct the URL with location and maxDistance query parameters
      const response = await fetch(
        `http://localhost:5000/api/requests/donor/${bloodGroup}?lat=${lat}&lng=${lng}&maxDistance=${maxDistance}`
      );
      
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

  const handleRespond = (request) => {
    setRespondingTo(request);
    setResponseMessage('');
  };

  const cancelResponse = () => {
    setRespondingTo(null);
    setResponseMessage('');
  };

  const submitResponse = async () => {
    if (!responseMessage.trim()) {
      alert('Please enter a response message');
      return;
    }

    // Debug logging
    console.log('Submitting response with data:', {
      requestId: respondingTo._id,
      donorId: user._id,
      message: responseMessage.trim(),
      user: user
    });

    try {
      setSubmittingResponse(true);
      
      const response = await fetch('http://localhost:5000/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: respondingTo._id,
          donorId: user._id,
          message: responseMessage.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Response error:', errorData);
        throw new Error(errorData.message || 'Failed to submit response');
      }

      const result = await response.json();
      console.log('Response submitted successfully:', result);

      alert('Response submitted successfully! The hospital will be notified.');
      setRespondingTo(null);
      setResponseMessage('');
      
      // Refresh the requests to show updated status
      fetchRequestsByBloodGroup(user.bloodGroup, user.latitude, user.longitude); // Pass profile location
      
    } catch (error) {
      alert(`Error submitting response: ${error.message}`);
      console.error('Error submitting response:', error);
    } finally {
      setSubmittingResponse(false);
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

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'Emergency': return '🚨';
      case 'High': return '⚠️';
      case 'Medium': return '⚡';
      case 'Low': return '📋';
      default: return '📋';
    }
  };

  const getUrgencyPriority = (urgency) => {
    const priorities = { 'Emergency': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorities[urgency] || 1;
  };

  // Sort requests by urgency priority and then by creation date
  const sortedRequests = [...requests].sort((a, b) => {
    const priorityDiff = getUrgencyPriority(b.urgency) - getUrgencyPriority(a.urgency);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) {
    return (
      <div className="alerts-container">
        <div className="alerts-header">
          <h2>Blood Donation Alerts</h2>
          <p>Loading blood donation requests for your blood type and nearby locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alerts-container">
        <div className="alerts-header">
          <h2>Blood Donation Alerts</h2>
          <p>Error loading requests: {error}</p>
          <button onClick={() => fetchRequestsByBloodGroup(user.bloodGroup, user.latitude, user.longitude)} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user || !user.bloodGroup) {
    return (
      <div className="alerts-container">
        <div className="alerts-header">
          <h2>Blood Donation Alerts</h2>
          <p>Unable to load your blood group information. Please check your profile.</p>
        </div>
      </div>
    );
  }
  
  // Removed the check for donorLocation as we are now using profile location

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h2>Blood Donation Alerts</h2>
        <p>
          Blood requests matching your blood type: <span className="blood-type-highlight">{user.bloodGroup}</span>
        </p>
        <p className="subtitle">These hospitals need your blood type. Consider donating if you're eligible!</p>
      </div>
      
      {sortedRequests.length === 0 ? (
        <div className="no-requests">
          <div className="no-requests-icon">🩸</div>
          <h3>No Active Requests</h3>
          <p>There are currently no blood donation requests for your blood type ({user.bloodGroup}) within your vicinity.</p>
          <p>Check back later or consider donating proactively!</p>
        </div>
      ) : (
        <div className="alerts-grid">
          {sortedRequests.map((request) => (
            <div key={request._id} className="alert-card">
              <div className="alert-header">
                <div className="alert-title">
                  <h3>Blood Request #{request.id}</h3>
                  <span className="hospital-name">
                    {request.hospitalId?.name || 'Unknown Hospital'}
                  </span>
                </div>
                <span 
                  className="urgency-badge"
                  style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                >
                  {getUrgencyIcon(request.urgency)} {request.urgency}
                </span>
              </div>
              
              <div className="blood-type-badge">
                Blood Type: <strong>{request.bloodGroup}</strong>
              </div>
              
              <p className="alert-message">{request.message}</p>
              
              <div className="hospital-info">
                <span className="hospital-location">
                  📍 {request.hospitalId?.address?.city}, {request.hospitalId?.address?.state}
                </span>
              </div>
              
              <div className="alert-footer">
                <span className="quantity">Quantity Needed: <strong>{request.quantity} units</strong></span>
                <span className="timestamp">
                  📅 {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="alert-actions">
                <button 
                  className="respond-btn primary"
                  onClick={() => handleRespond(request)}
                >
                  Respond to Alert
                </button>
                <button className="respond-btn secondary">
                  View Hospital Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="alerts-footer">
        <p>
          <strong>Note:</strong> Only active blood requests matching your blood type ({user.bloodGroup}) and nearby locations are shown.
        </p>
        <p>
          If you're eligible to donate, please consider responding to these urgent requests.
        </p>
      </div>

      {/* Response Modal */}
      {respondingTo && (
        <div className="response-modal-overlay">
          <div className="response-modal">
            <div className="response-modal-header">
              <h3>Respond to Blood Request #{respondingTo.id}</h3>
              <button className="close-btn" onClick={cancelResponse}>×</button>
            </div>
            
            <div className="response-modal-content">
              <div className="request-summary">
                <p><strong>Hospital:</strong> {respondingTo.hospitalId?.name}</p>
                <p><strong>Blood Type:</strong> {respondingTo.bloodGroup}</p>
                <p><strong>Urgency:</strong> {respondingTo.urgency}</p>
                <p><strong>Message:</strong> {respondingTo.message}</p>
              </div>
              
              <div className="response-form">
                <label htmlFor="responseMessage">Your Response Message:</label>
                <textarea
                  id="responseMessage"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Enter your response message (e.g., 'I can donate on [date]', 'I'm available this week', etc.)"
                  rows="4"
                  maxLength="500"
                />
                <div className="char-count">
                  {responseMessage.length}/500 characters
                </div>
              </div>
            </div>
            
            <div className="response-modal-actions">
              <button 
                className="cancel-btn"
                onClick={cancelResponse}
                disabled={submittingResponse}
              >
                Cancel
              </button>
              <button 
                className="submit-btn"
                onClick={submitResponse}
                disabled={submittingResponse || !responseMessage.trim()}
              >
                {submittingResponse ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
