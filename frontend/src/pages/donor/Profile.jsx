import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    age: 28,
    gender: 'Male',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    bloodGroup: 'O+',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    numberOfTimesDonated: 5,
    lastDonated: '2024-01-15'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Implement save logic
    console.log('Profile updated:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // TODO: Reset to original data
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Donor Profile</h2>
        <p>Manage your personal information and donation history</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <div className="section-header">
            <h3>Personal Information</h3>
            {!isEditing && (
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
          
          <div className="profile-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={profileData.age}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
                min="18"
                max="65"
              />
            </div>
            
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-select"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Blood Group</label>
              <select
                name="bloodGroup"
                value={profileData.bloodGroup}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-select"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Contact Information</h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Address Information</h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                name="address.street"
                value={profileData.address.street}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="address.city"
                value={profileData.address.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="address.state"
                value={profileData.address.state}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="address.zipCode"
                value={profileData.address.zipCode}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Donation History</h3>
          <div className="donation-stats">
            <div className="stat-card">
              <div className="stat-number">{profileData.numberOfTimesDonated}</div>
              <div className="stat-label">Total Donations</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">
                {profileData.lastDonated ? 
                  new Date(profileData.lastDonated).toLocaleDateString() : 
                  'Never'
                }
              </div>
              <div className="stat-label">Last Donation</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">
                {profileData.lastDonated ? 
                  Math.ceil((new Date() - new Date(profileData.lastDonated)) / (1000 * 60 * 60 * 24)) : 
                  'N/A'
                }
              </div>
              <div className="stat-label">Days Since Last</div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="profile-actions">
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
