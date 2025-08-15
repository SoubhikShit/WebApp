const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  // Unique Identifier
  id: {
    type: String,
    required: [true, 'Request ID is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Request ID must be at least 3 characters long'],
    maxlength: [20, 'Request ID cannot exceed 20 characters'],
    match: [/^[A-Z0-9_-]+$/, 'Request ID can only contain uppercase letters, numbers, hyphens, and underscores']
  },
  
  // Hospital Reference
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'Hospital ID is required']
  },
  
  // Blood Group Required
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    trim: true
  },
  
  // Request Details
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  
  urgency: {
    type: String,
    required: [true, 'Urgency level is required'],
    enum: ['Low', 'Medium', 'High', 'Emergency'],
    default: 'Medium',
    trim: true
  },
  
  // Request Status
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['Pending', 'In Progress', 'Fulfilled', 'Cancelled'],
    default: 'Pending',
    trim: true
  },
  
  // Quantity Information
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    max: [1000, 'Quantity cannot exceed 1000 units']
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for blood group queries
requestSchema.index({ bloodGroup: 1 });

// Index for urgency queries
requestSchema.index({ urgency: 1 });

// Index for status queries
requestSchema.index({ status: 1 });

// Index for hospital ID queries
requestSchema.index({ hospitalId: 1 });

// Virtual for urgency priority (for sorting)
requestSchema.virtual('urgencyPriority').get(function() {
  const priorities = {
    'Low': 1,
    'Medium': 2,
    'High': 3,
    'Emergency': 4
  };
  return priorities[this.urgency] || 2;
});

// Static method to find requests by blood group
requestSchema.statics.findByBloodGroup = function(bloodGroup) {
  return this.find({
    bloodGroup: bloodGroup,
    status: { $in: ['Pending', 'In Progress'] }
  }).sort({ urgencyPriority: -1, createdAt: 1 });
};

// Static method to find requests by urgency
requestSchema.statics.findByUrgency = function(urgency) {
  return this.find({
    urgency: urgency,
    status: { $in: ['Pending', 'In Progress'] }
  }).sort({ createdAt: 1 });
};

// Static method to find requests by hospital
requestSchema.statics.findByHospital = function(hospitalId) {
  return this.find({
    hospitalId: hospitalId
  }).sort({ createdAt: -1 });
};

// Static method to find request by custom ID
requestSchema.statics.findByCustomId = function(id) {
  return this.findOne({ id: id.toUpperCase() });
};

// Instance method to update status
requestSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  return this.save();
};

// Instance method to mark as fulfilled
requestSchema.methods.markFulfilled = function() {
  this.status = 'Fulfilled';
  return this.save();
};

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
