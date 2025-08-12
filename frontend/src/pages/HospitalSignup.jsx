import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HospitalSignup.css';

const HospitalSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    latitude: '',
    longitude: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // ID validation
    if (!formData.id) {
      newErrors.id = 'Hospital ID is required';
    } else if (formData.id.length < 3) {
      newErrors.id = 'Hospital ID must be at least 3 characters';
    } else if (!/^[A-Z0-9_-]+$/.test(formData.id)) {
      newErrors.id = 'Hospital ID can only contain uppercase letters, numbers, hyphens, and underscores';
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Hospital name is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    // Address validation
    if (!formData.address.street) newErrors.street = 'Street address is required';
    if (!formData.address.city) newErrors.city = 'City is required';
    if (!formData.address.state) newErrors.state = 'State is required';
    if (!formData.address.zipCode) newErrors.zipCode = 'ZIP code is required';

    // Coordinates validation
    if (!formData.latitude) {
      newErrors.latitude = 'Latitude is required';
    } else if (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }

    if (!formData.longitude) {
      newErrors.longitude = 'Longitude is required';
    } else if (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Convert ID to uppercase
        const submitData = {
          ...formData,
          id: formData.id.toUpperCase(),
          email: formData.email.toLowerCase()
        };

        // Remove confirmPassword from submit data
        delete submitData.confirmPassword;

        console.log('Hospital Signup Data:', submitData);
        
        // TODO: Make API call to backend
        // const response = await fetch('/api/hospitals/signup', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(submitData)
        // });

        alert('Hospital registration successful! Please login.');
        navigate('/login/hospital');
      } catch (error) {
        console.error('Signup error:', error);
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="hospital-signup-container">
      <form className="hospital-signup-form" onSubmit={handleSubmit}>
        <h2>🏥 Hospital Registration</h2>
        <p className="form-subtitle">Create your hospital account</p>

        <div className="form-section">
          <h3>Hospital Information</h3>
          
          <div className="form-group">
            <label>Hospital ID *</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="e.g., HOSP001, CITY_GEN"
              className={errors.id ? 'error' : ''}
            />
            {errors.id && <span className="error-message">{errors.id}</span>}
          </div>

          <div className="form-group">
            <label>Hospital Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter hospital name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Authentication</h3>
          
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hospital@example.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Address</h3>
          
          <div className="form-group">
            <label>Street Address *</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="123 Main Street"
              className={errors.street ? 'error' : ''}
            />
            {errors.street && <span className="error-message">{errors.street}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="State"
                className={errors.state ? 'error' : ''}
              />
              {errors.state && <span className="error-message">{errors.state}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>ZIP Code *</label>
            <input
              type="text"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
              placeholder="12345"
              className={errors.zipCode ? 'error' : ''}
            />
            {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Location Coordinates</h3>
          <p className="help-text">Enter the exact coordinates of your hospital location</p>
          
          <div className="form-row">
            <div className="form-group">
              <label>Latitude *</label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="40.7128"
                step="any"
                className={errors.latitude ? 'error' : ''}
              />
              {errors.latitude && <span className="error-message">{errors.latitude}</span>}
            </div>

            <div className="form-group">
              <label>Longitude *</label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="-74.0060"
                step="any"
                className={errors.longitude ? 'error' : ''}
              />
              {errors.longitude && <span className="error-message">{errors.longitude}</span>}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="signup-btn">Create Hospital Account</button>
          <button type="button" className="back-btn" onClick={() => navigate('/login/hospital')}>
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default HospitalSignup;
