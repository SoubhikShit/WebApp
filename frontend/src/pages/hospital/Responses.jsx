import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Hospital.css';

const Responses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user && user._id) {
      fetchResponses();
    }
  }, [user]);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:5000/api/responses/hospital/${user._id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch responses');
      }
      
      const data = await response.json();
      setResponses(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching responses:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this blood request? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete request');
      }

      // Remove the response from the list
      setResponses(prev => prev.filter(resp => resp.requestId.id !== requestId));
      
      alert('Blood request deleted successfully');
    } catch (err) {
      alert(`Error deleting request: ${err.message}`);
      console.error('Error deleting request:', err);
    }
  };

  const deactivateResponse = async (responseId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/responses/${responseId}/deactivate`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate response');
      }

      // Update the response in the list
      setResponses(prev => prev.map(resp => 
        resp._id === responseId ? { ...resp, isActive: false } : resp
      ));
      
      alert('Response deactivated successfully');
    } catch (err) {
      alert(`Error deactivating response: ${err.message}`);
      console.error('Error deactivating response:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString();
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
      <div className="responses-container">
        <div className="responses-header">
          <h2>Donor Responses</h2>
          <p>Loading responses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="responses-container">
        <div className="responses-header">
          <h2>Donor Responses</h2>
          <p>Error loading responses: {error}</p>
          <button onClick={fetchResponses} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="responses-container">
      <div className="responses-header">
        <h2>Donor Responses</h2>
        <p>View and manage responses from donors to your blood requests</p>
      </div>
      
      {responses.length === 0 ? (
        <div className="no-responses">
          <div className="no-responses-icon">📋</div>
          <h3>No Responses Yet</h3>
          <p>You haven't received any responses from donors yet.</p>
          <p>Create blood requests to start receiving donor responses.</p>
        </div>
      ) : (
        <div className="responses-grid">
          {responses.map((response) => (
            <div key={response._id} className="response-card">
              <div className="response-header">
                <div className="request-info">
                  <h3>Request #{response.requestId.id}</h3>
                  <div className="request-details">
                    <span className="blood-group">{response.requestId.bloodGroup}</span>
                    <span 
                      className="urgency-badge"
                      style={{ backgroundColor: getUrgencyColor(response.requestId.urgency) }}
                    >
                      {response.requestId.urgency}
                    </span>
                  </div>
                </div>
                <div className="response-status">
                  <span className={`status ${response.isActive ? 'active' : 'inactive'}`}>
                    {response.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="request-message">
                <strong>Request Message:</strong> {response.requestId.message}
              </div>
              
              <div className="donor-responses">
                <h4>Donor Responses ({response.responses.length})</h4>
                {response.responses.map((donorResponse, index) => (
                  <div key={index} className="donor-response">
                    <div className="donor-info">
                      <span className="donor-name">{donorResponse.donorId.name}</span>
                      <span className="donor-email">{donorResponse.donorId.email}</span>
                    </div>
                    <div className="donor-message">{donorResponse.message}</div>
                    <div className="response-time">
                      Responded: {formatDate(donorResponse.timeOfCreation)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="response-actions">
                <button 
                  className="action-btn deactivate-btn"
                  onClick={() => deactivateResponse(response._id)}
                  disabled={!response.isActive}
                >
                  Deactivate Response
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => deleteRequest(response.requestId._id)}
                >
                  Delete Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Responses;
