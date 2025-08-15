const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  // Request ID that this response is for
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: [true, 'Request ID is required']
  },
  
  // Hospital ID that created the request
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
    // Made optional initially to avoid validation errors with existing data
  },
  
  // Array of donor responses
  responses: [{
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: [true, 'Donor ID is required']
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    date: {
      type: Date,
      default: Date.now
    },
    timeOfCreation: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Whether the response is still active
  isActive: {
    type: Boolean,
    default: true
  }
  
}, {
  timestamps: true
});

// Index for request ID queries
responseSchema.index({ requestId: 1 });

// Index for hospital ID queries
responseSchema.index({ hospitalId: 1 });

// Index for active responses
responseSchema.index({ isActive: 1 });

// Static method to find responses by request ID
responseSchema.statics.findByRequestId = function(requestId) {
  return this.findOne({ requestId: requestId });
};

// Static method to find responses by hospital ID
responseSchema.statics.findByHospitalId = function(hospitalId) {
  return this.find({ hospitalId: hospitalId, isActive: true });
};

// Static method to find active responses
responseSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Instance method to add a donor response
responseSchema.methods.addDonorResponse = function(donorId, message) {
  this.responses.push({
    donorId,
    message,
    date: new Date(),
    timeOfCreation: new Date()
  });
  return this.save();
};

// Instance method to deactivate response
responseSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
