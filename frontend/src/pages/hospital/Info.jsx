import React from 'react';
import './Hospital.css';

const Info = () => {
  const hospitalInfo = {
    name: "City General Hospital",
    id: "HOSP001",
    email: "info@citygeneral.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "456 Medical Center Drive",
      city: "New York",
      state: "NY",
      zipCode: "10002"
    },
    specialties: ["Emergency Medicine", "Cardiology", "Neurology", "Pediatrics"],
    capacity: 500,
    established: "1985",
    accreditation: "Joint Commission Accredited",
    emergencyServices: true,
    traumaCenter: "Level I"
  };

  const stats = [
    { label: "Total Beds", value: hospitalInfo.capacity, icon: "🏥" },
    { label: "Years Established", value: new Date().getFullYear() - parseInt(hospitalInfo.established), icon: "📅" },
    { label: "Specialties", value: hospitalInfo.specialties.length, icon: "⚕️" },
    { label: "Trauma Level", value: hospitalInfo.traumaCenter, icon: "🚨" }
  ];

  return (
    <div className="info-container">
      <div className="info-header">
        <h2>Hospital Information</h2>
        <p>Comprehensive overview of hospital details and capabilities</p>
      </div>

      <div className="info-content">
        <div className="info-section">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Hospital Name</label>
              <span>{hospitalInfo.name}</span>
            </div>
            
            <div className="info-item">
              <label>Hospital ID</label>
              <span>{hospitalInfo.id}</span>
            </div>
            
            <div className="info-item">
              <label>Established</label>
              <span>{hospitalInfo.established}</span>
            </div>
            
            <div className="info-item">
              <label>Accreditation</label>
              <span>{hospitalInfo.accreditation}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Contact Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Email Address</label>
              <span>{hospitalInfo.email}</span>
            </div>
            
            <div className="info-item">
              <label>Phone Number</label>
              <span>{hospitalInfo.phone}</span>
            </div>
            
            <div className="info-item full-width">
              <label>Address</label>
              <span>
                {hospitalInfo.address.street}, {hospitalInfo.address.city}, {hospitalInfo.address.state} {hospitalInfo.address.zipCode}
              </span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Hospital Statistics</h3>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>Medical Specialties</h3>
          <div className="specialties-grid">
            {hospitalInfo.specialties.map((specialty, index) => (
              <div key={index} className="specialty-card">
                <span className="specialty-name">{specialty}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>Emergency Services</h3>
          <div className="emergency-info">
            <div className="emergency-item">
              <label>Emergency Services Available</label>
              <span className={hospitalInfo.emergencyServices ? "status-available" : "status-unavailable"}>
                {hospitalInfo.emergencyServices ? "Yes" : "No"}
              </span>
            </div>
            
            <div className="emergency-item">
              <label>Trauma Center Level</label>
              <span className="trauma-level">{hospitalInfo.traumaCenter}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
