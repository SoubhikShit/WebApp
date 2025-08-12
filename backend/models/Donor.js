const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  // Unique Identifier
  id: {
    type: String,
    required: [true, 'Donor ID is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Donor ID must be at least 3 characters long'],
    maxlength: [20, 'Donor ID cannot exceed 20 characters'],
    match: [/^[A-Z0-9_-]+$/, 'Donor ID can only contain uppercase letters, numbers, hyphens, and underscores']
  },
  
  // Personal Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Donor must be at least 18 years old'],
    max: [65, 'Donor cannot be older than 65 years']
  },
  
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other'],
    trim: true
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  
  // Authentication
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
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
  
  // Blood Information
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    trim: true
  },
  
  // Donation History
  numberOfTimesDonated: {
    type: Number,
    default: 0,
    min: [0, 'Number of donations cannot be negative']
  },
  
  lastDonated: {
    type: Date,
    default: null
  },
  

  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
donorSchema.index({ location: '2dsphere' });

// Index for blood group queries
donorSchema.index({ bloodGroup: 1 });

// Index for blood group queries
donorSchema.index({ bloodGroup: 1 });

// Virtual for full address
donorSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Virtual for location object (for geospatial queries)
donorSchema.virtual('location').get(function() {
  return {
    type: 'Point',
    coordinates: [this.longitude, this.latitude]
  };
});



// Virtual for days since last donation
donorSchema.virtual('daysSinceLastDonation').get(function() {
  if (this.lastDonated) {
    const now = new Date();
    const lastDonation = new Date(this.lastDonated);
    const diffTime = Math.abs(now - lastDonation);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for donation frequency (donations per year)
donorSchema.virtual('donationFrequency').get(function() {
  if (this.createdAt && this.numberOfTimesDonated > 0) {
    const now = new Date();
    const yearsSinceRegistration = (now - this.createdAt) / (1000 * 60 * 60 * 24 * 365.25);
    return (this.numberOfTimesDonated / yearsSinceRegistration).toFixed(2);
  }
  return 0;
});

// Pre-save middleware to update location
donorSchema.pre('save', function(next) {
  this.location = {
    type: 'Point',
    coordinates: [this.longitude, this.latitude]
  };
  next();
});

// Static method to find donors by blood group near a location
donorSchema.statics.findNearby = function(longitude, latitude, bloodGroup, maxDistance = 50000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    },
    bloodGroup: bloodGroup
  }).sort({ 'lastDonated': 1 }); // Sort by last donation date (oldest first)
};

// Static method to find donors by blood group
donorSchema.statics.findByBloodGroup = function(bloodGroup) {
  return this.find({
    bloodGroup: bloodGroup
  });
};

// Static method to find donor by ID
donorSchema.statics.findById = function(id) {
  return this.findOne({ id: id.toUpperCase() });
};

// Static method to find donor by email (for login)
donorSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Instance method to get distance from a point
donorSchema.methods.getDistanceFrom = function(longitude, latitude) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (latitude - this.latitude) * Math.PI / 180;
  const dLon = (longitude - this.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.latitude * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Instance method to check if donor can donate again
donorSchema.methods.canDonateAgain = function() {
  if (this.lastDonated) {
    const now = new Date();
    const lastDonation = new Date(this.lastDonated);
    const daysSinceLastDonation = (now - lastDonation) / (1000 * 60 * 60 * 24);
    
    // Minimum 56 days (8 weeks) between donations for males
    // Minimum 84 days (12 weeks) between donations for females
    const minDays = this.gender === 'Female' ? 84 : 56;
    
    return daysSinceLastDonation >= minDays;
  }
  
  return true;
};

// Instance method to record a donation
donorSchema.methods.recordDonation = function() {
  this.numberOfTimesDonated += 1;
  this.lastDonated = new Date();
  return this.save();
};

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;
