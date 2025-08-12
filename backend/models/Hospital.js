const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  // Unique Identifier
  id: {
    type: String,
    required: [true, 'Hospital ID is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Hospital ID must be at least 3 characters long'],
    maxlength: [20, 'Hospital ID cannot exceed 20 characters'],
    match: [/^[A-Z0-9_-]+$/, 'Hospital ID can only contain uppercase letters, numbers, hyphens, and underscores']
  },
  
  // Basic Information
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true,
    maxlength: [100, 'Hospital name cannot exceed 100 characters']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  
  // Address Information
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true
    },
  },
  
  // Location Coordinates
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90']
  },
  
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180']
  },
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
hospitalSchema.index({ location: '2dsphere' });

// Virtual for full address
hospitalSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Virtual for location object (for geospatial queries)
hospitalSchema.virtual('location').get(function() {
  return {
    type: 'Point',
    coordinates: [this.longitude, this.latitude]
  };
});

// Pre-save middleware to update location
hospitalSchema.pre('save', function(next) {
  this.location = {
    type: 'Point',
    coordinates: [this.longitude, this.latitude]
  };
  next();
});

// Static method to find hospitals near a location
hospitalSchema.statics.findNearby = function(longitude, latitude, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  });
};

// Instance method to get distance from a point
hospitalSchema.methods.getDistanceFrom = function(longitude, latitude) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (latitude - this.latitude) * Math.PI / 180;
  const dLon = (longitude - this.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.latitude * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Static method to find hospital by ID
hospitalSchema.statics.findById = function(id) {
  return this.findOne({ id: id.toUpperCase() });
};

// Static method to find hospital by name (for login)
hospitalSchema.statics.findByName = function(name) {
  return this.findOne({ name: { $regex: name, $options: 'i' } });
};

// Static method to find hospital by email
hospitalSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find hospitals by city
hospitalSchema.statics.findByCity = function(city) {
  return this.find({ 'address.city': { $regex: city, $options: 'i' } });
};

// Static method to find hospitals by state
hospitalSchema.statics.findByState = function(state) {
  return this.find({ 'address.state': { $regex: state, $options: 'i' } });
};

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
