import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Hospital.css';

const BloodData = () => {
  const [requestData, setRequestData] = useState({
    bloodType: '',
    quantity: '',
    urgency: 'normal',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { user } = useAuth();

  const bloodInventory = [
    { type: 'A+', quantity: 45, status: 'Available' },
    { type: 'A-', quantity: 12, status: 'Low' },
    { type: 'B+', quantity: 38, status: 'Available' },
    { type: 'B-', quantity: 8, status: 'Critical' },
    { type: 'AB+', quantity: 15, status: 'Available' },
    { type: 'AB-', quantity: 5, status: 'Critical' },
    { type: 'O+', quantity: 67, status: 'Available' },
    { type: 'O-', quantity: 23, status: 'Available' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'var(--success-color)';
      case 'Low': return 'var(--warning-color)';
      case 'Critical': return 'var(--danger-color)';
      default: return 'var(--text-secondary)';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!requestData.bloodType || !requestData.quantity) {
      setMessage('Please fill in all required fields');
      return;
    }

    if (!user || !user._id) {
      setMessage('Error: Hospital information not available');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      // Create request data that matches the backend Request model
      const requestPayload = {
        id: `REQ${Date.now()}`, // Generate unique ID
        bloodGroup: requestData.bloodType,
        message: requestData.notes || `Blood request for ${requestData.bloodType} blood group`,
        urgency: requestData.urgency === 'normal' ? 'Medium' : 
                 requestData.urgency === 'urgent' ? 'High' : 'Emergency',
        quantity: parseInt(requestData.quantity),
        hospitalId: user._id // Use the actual hospital ID from context
      };

      console.log('Submitting request payload:', requestPayload);

      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Request created successfully:', result);
      setMessage('Blood request submitted successfully!');
      
      // Reset form
      setRequestData({
        bloodType: '',
        quantity: '',
        urgency: 'normal',
        notes: ''
      });

    } catch (error) {
      console.error('Error submitting request:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blood-data-container">
      <div className="blood-data-header">
        <h2>Blood Inventory Management</h2>
        <p>Monitor blood stock levels and submit requests</p>
      </div>
      
      <div className="blood-data-content">
        <div className="inventory-section">
          <h3>Current Blood Inventory</h3>
          <div className="blood-inventory-grid">
            {bloodInventory.map((blood) => (
              <div key={blood.type} className="blood-card">
                <div className="blood-type-header">
                  <h4>Blood Type: {blood.type}</h4>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(blood.status) }}
                  >
                    {blood.status}
                  </span>
                </div>
                
                <div className="quantity-display">
                  <span className="quantity-number">{blood.quantity}</span>
                  <span className="quantity-unit">units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="request-section">
          <h3>Blood Request Form</h3>
          <form className="request-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Blood Type:</label>
              <select 
                className="blood-type-select"
                name="bloodType"
                value={requestData.bloodType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Blood Type</option>
                {bloodInventory.map((blood) => (
                  <option key={blood.type} value={blood.type}>
                    {blood.type}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Quantity Needed (units):</label>
              <input
                type="number"
                name="quantity"
                value={requestData.quantity}
                onChange={handleInputChange}
                placeholder="Enter quantity"
                min="1"
                max="1000"
                className="quantity-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Urgency:</label>
              <select 
                className="urgency-select"
                name="urgency"
                value={requestData.urgency}
                onChange={handleInputChange}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Notes:</label>
              <textarea
                name="notes"
                placeholder="Additional information about the request..."
                className="notes-textarea"
                rows="3"
                value={requestData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
            
            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
            
            <button 
              type="submit" 
              className="submit-request-btn"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Blood Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BloodData;
