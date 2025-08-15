import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setDonorData(user);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!donorData) {
    return <div className="profile-error">No donor data available</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never donated';
    return new Date(dateString).toLocaleDateString();
  };

  const getDonationStatus = () => {
    if (!donorData.lastDonated) return 'Eligible to donate';
    
    const lastDonation = new Date(donorData.lastDonated);
    const now = new Date();
    const daysSinceLastDonation = Math.floor((now - lastDonation) / (1000 * 60 * 60 * 24));
    
    const minDays = donorData.gender === 'Female' ? 84 : 56;
    
    if (daysSinceLastDonation >= minDays) {
      return 'Eligible to donate';
    } else {
      const remainingDays = minDays - daysSinceLastDonation;
      return `Eligible in ${remainingDays} days`;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Donor Profile</h2>
        <p>Your personal information and donation history</p>
      </div>
      
      <div className="profile-content">
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Donor ID:</label>
              <span>{donorData.id}</span>
            </div>
            <div className="profile-item">
              <label>Full Name:</label>
              <span>{donorData.name}</span>
            </div>
            <div className="profile-item">
              <label>Age:</label>
              <span>{donorData.age} years</span>
            </div>
            <div className="profile-item">
              <label>Gender:</label>
              <span>{donorData.gender}</span>
            </div>
            <div className="profile-item">
              <label>Blood Group:</label>
              <span className="blood-group">{donorData.bloodGroup}</span>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h3>Contact Information</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Email:</label>
              <span>{donorData.email}</span>
            </div>
            <div className="profile-item">
              <label>Phone:</label>
              <span>{donorData.phone}</span>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h3>Address</h3>
          <div className="profile-grid">
            <div className="profile-item full-width">
              <label>Street Address:</label>
              <span>{donorData.address.street}</span>
            </div>
            <div className="profile-item">
              <label>City:</label>
              <span>{donorData.address.city}</span>
            </div>
            <div className="profile-item">
              <label>State:</label>
              <span>{donorData.address.state}</span>
            </div>
            <div className="profile-item">
              <label>ZIP Code:</label>
              <span>{donorData.address.zipCode}</span>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h3>Location</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Latitude:</label>
              <span>{donorData.latitude}</span>
            </div>
            <div className="profile-item">
              <label>Longitude:</label>
              <span>{donorData.longitude}</span>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h3>Donation History</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Total Donations:</label>
              <span className="donation-count">{donorData.numberOfTimesDonated}</span>
            </div>
            <div className="profile-item">
              <label>Last Donation:</label>
              <span>{formatDate(donorData.lastDonated)}</span>
            </div>
            <div className="profile-item">
              <label>Donation Status:</label>
              <span className={`status ${getDonationStatus().includes('Eligible') ? 'eligible' : 'waiting'}`}>
                {getDonationStatus()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h3>Account Information</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Member Since:</label>
              <span>{new Date(donorData.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="profile-item">
              <label>Last Updated:</label>
              <span>{new Date(donorData.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
