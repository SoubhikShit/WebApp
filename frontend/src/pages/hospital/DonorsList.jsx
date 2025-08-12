import React from 'react';
import './Hospital.css';

const donors = [
  { id: 1, name: 'John Doe', bloodType: 'A+', lastDonation: '2025-06-01' },
  { id: 2, name: 'Jane Smith', bloodType: 'O-', lastDonation: '2025-07-15' },
  { id: 3, name: 'Michael Lee', bloodType: 'B+', lastDonation: '2025-05-20' },
];

const DonorsList = () => {
  const handleClick = (id) => {
    alert(`Open donor details for ID: ${id}`); // Placeholder for detailed page navigation
  };

  return (
    <div className="hospital-page-container">
      <h2>Donors List</h2>
      <div className="interactive-list">
        {donors.map(donor => (
          <div
            key={donor.id}
            className="interactive-block"
            onClick={() => handleClick(donor.id)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => e.key === 'Enter' && handleClick(donor.id)}
          >
            <h3>{donor.name}</h3>
            <p>Blood Type: {donor.bloodType}</p>
            <p>Last Donation: {donor.lastDonation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorsList;
