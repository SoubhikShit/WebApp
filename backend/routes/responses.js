const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Request = require('../models/Request');

// POST /api/responses - Create a new response or add to existing one
router.post('/', async (req, res) => {
  try {
    const { requestId, donorId, message } = req.body;
    
    console.log('Received response request:', { requestId, donorId, message });
    
    // Validate required fields
    if (!requestId || !donorId || !message) {
      console.log('Missing required fields:', { requestId, donorId, message });
      return res.status(400).json({ 
        message: 'All fields are required: requestId, donorId, message' 
      });
    }
    
    // Check if request exists
    // Try to find by ObjectId first (Mongoose's built-in findById)
    let request = await Request.findById(requestId);
    
    if (!request) {
      // If not found by ObjectId, try by custom 'id' field
      request = await Request.findOne({ id: requestId });
    }
    
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }
    
    console.log('Found request:', { 
      requestId: request._id, 
      hospitalId: request.hospitalId,
      bloodGroup: request.bloodGroup 
    });
    
    // Check if response already exists for this request
    let response = await Response.findOne({ requestId });
    
    if (response) {
      console.log('Adding to existing response:', response._id);
      // Add donor response to existing response
      await response.addDonorResponse(donorId, message);
    } else {
      console.log('Creating new response with hospitalId:', request.hospitalId);
      // Create new response with hospitalId from the request
      response = new Response({
        requestId,
        hospitalId: request.hospitalId, // Get hospitalId from the request
        responses: [{
          donorId,
          message,
          date: new Date(),
          timeOfCreation: new Date()
        }]
      });
      await response.save();
      console.log('New response created:', response._id);
    }
    
    // Populate donor information for the response
    await response.populate('responses.donorId', 'name email');
    await response.populate('requestId', 'id bloodGroup urgency');
    
    console.log('Response created/updated successfully');
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating response:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/responses/request/:requestId - Get responses for a specific request
router.get('/request/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const response = await Response.findOne({ requestId })
      .populate('responses.donorId', 'name email')
      .populate('requestId', 'id bloodGroup urgency message');
    
    if (!response) {
      return res.status(404).json({ message: 'No responses found for this request' });
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/responses/hospital/:hospitalId - Get all responses for requests from a specific hospital
router.get('/hospital/:hospitalId', async (req, res) => {
  try {
    const { hospitalId } = req.params;
    
    // First get all requests from this hospital
    const requests = await Request.find({ hospitalId });
    const requestIds = requests.map(req => req._id);
    
    // Get responses using both methods:
    // 1. New method: responses with hospitalId field
    const newResponses = await Response.find({ 
      hospitalId: hospitalId, 
      isActive: true 
    });
    
    // 2. Old method: responses for requests from this hospital (for backward compatibility)
    const oldResponses = await Response.find({ 
      requestId: { $in: requestIds },
      isActive: true,
      hospitalId: { $exists: false } // Only get responses without hospitalId
    });
    
    // Combine both results
    const allResponses = [...newResponses, ...oldResponses];
    
    // Populate and sort
    const populatedResponses = await Response.populate(allResponses, [
      { path: 'responses.donorId', select: 'name email' },
      { path: 'requestId', select: 'id bloodGroup urgency message' }
    ]);
    
    // Sort by creation date
    populatedResponses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(populatedResponses);
  } catch (error) {
    console.error('Error fetching hospital responses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/responses/:id/deactivate - Deactivate a response
router.put('/:id/deactivate', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await Response.findById(id);
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }
    
    await response.deactivate();
    res.json({ message: 'Response deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating response:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/responses/:id - Delete a response completely
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await Response.findByIdAndDelete(id);
    if (!response) {
      return res.status(404).json({ message: 'Response deleted successfully' });
    }
    
    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Error deleting response:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/responses/request/:requestId/prioritized - Get responses prioritized by distance
router.get('/request/:requestId/prioritized', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Find the request and populate hospital details
    const request = await Request.findById(requestId)
      .populate('hospitalId', 'name address latitude longitude');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Find responses for this request
    const response = await Response.findOne({ requestId })
      .populate('responses.donorId', 'name email latitude longitude address')
      .populate('requestId', 'id bloodGroup urgency message');
    
    if (!response) {
      return res.status(404).json({ message: 'No responses found for this request' });
    }
    
    const hospital = request.hospitalId;
    
    // Calculate distance for each donor response and sort by priority
    const prioritizedResponses = response.responses
      .map(donorResponse => {
        const donor = donorResponse.donorId;
        if (!donor.latitude || !donor.longitude) {
          return {
            ...donorResponse.toObject(),
            distance: null,
            priority: 'Low',
            priorityReason: 'Location coordinates not available'
          };
        }
        
        const distance = calculateDistance(
          hospital.latitude, hospital.longitude,
          donor.latitude, donor.longitude
        );
        
        // Determine priority based on distance
        let priority, priorityReason;
        if (distance <= 5) {
          priority = 'High';
          priorityReason = 'Within 5km radius';
        } else if (distance <= 10) {
          priority = 'Medium';
          priorityReason = 'Within 10km radius';
        } else {
          priority = 'Low';
          priorityReason = 'Outside 10km radius';
        }
        
        return {
          ...donorResponse.toObject(),
          distance: distance,
          priority: priority,
          priorityReason: priorityReason
        };
      })
      .sort((a, b) => {
        // Sort by priority first, then by distance
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        
        if (priorityDiff !== 0) return priorityDiff;
        
        // If same priority, sort by distance (closest first)
        if (a.distance && b.distance) {
          return a.distance - b.distance;
        }
        
        return 0;
      });
    
    res.json({
      request: {
        id: request.id,
        bloodGroup: request.bloodGroup,
        urgency: request.urgency,
        message: request.message
      },
      hospital: {
        name: hospital.name,
        address: hospital.address,
        coordinates: {
          latitude: hospital.latitude,
          longitude: hospital.longitude
        }
      },
      totalResponses: prioritizedResponses.length,
      prioritizedResponses: prioritizedResponses,
      prioritySystem: {
        'High': 'Within 5km radius - Notify immediately',
        'Medium': 'Within 10km radius - Notify within 1 hour',
        'Low': 'Outside 10km radius - Notify as backup'
      }
    });
    
  } catch (error) {
    console.error('Error getting prioritized responses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

module.exports = router;
