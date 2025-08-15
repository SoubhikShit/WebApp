const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// GET all blood requests
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('hospitalId', 'name address')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET requests by blood group (for donors)
router.get('/donor/:bloodGroup', async (req, res) => {
  try {
    const { bloodGroup } = req.params;
    const { maxDistance, city, state } = req.query;
    
    // Validate blood group
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({ message: 'Invalid blood group' });
    }
    
    // Build query for requests
    const query = {
      bloodGroup: bloodGroup,
      status: { $in: ['Pending', 'In Progress'] } // Only show active requests
    };
    
    // Find requests with matching blood group and active status
    let requests = await Request.find(query)
      .populate('hospitalId', 'name address latitude longitude')
      .sort({ 
        urgency: -1, // Emergency first, then High, Medium, Low
        createdAt: -1 // Newest first within same urgency
      });
    
    // Apply additional filters if provided
    if (city || state) {
      requests = requests.filter(request => {
        const hospital = request.hospitalId;
        if (!hospital) return false;
        
        if (city && hospital.address.city.toLowerCase() !== city.toLowerCase()) {
          return false;
        }
        if (state && hospital.address.state.toLowerCase() !== state.toLowerCase()) {
          return false;
        }
        
        return true;
      });
    }
    
    // Apply distance filtering if maxDistance is provided
    if (maxDistance && req.query.lat && req.query.lng) {
      const donorLat = parseFloat(req.query.lat);
      const donorLng = parseFloat(req.query.lng);
      const maxDist = parseFloat(maxDistance);
      
      requests = requests.filter(request => {
        const hospital = request.hospitalId;
        if (!hospital || !hospital.latitude || !hospital.longitude) return false;
        
        // Calculate distance using Haversine formula
        const R = 6371; // Earth's radius in kilometers
        const dLat = (hospital.latitude - donorLat) * Math.PI / 180;
        const dLon = (hospital.longitude - donorLng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(donorLat * Math.PI / 180) * Math.cos(hospital.latitude * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance <= maxDist;
      });
    }
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests by blood group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET requests by hospital ID
router.get('/hospital/:hospitalId', async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const requests = await Request.find({ hospitalId })
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching hospital requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST new blood request
router.post('/', async (req, res) => {
  try {
    const { id, bloodGroup, message, urgency, quantity, hospitalId } = req.body;
    
    // Validate required fields
    if (!id || !bloodGroup || !message || !urgency || !quantity || !hospitalId) {
      return res.status(400).json({ 
        message: 'All fields are required: id, bloodGroup, message, urgency, quantity, hospitalId' 
      });
    }
    
    // Create new request
    const newRequest = new Request({
      id,
      bloodGroup,
      message,
      urgency,
      quantity,
      hospitalId,
      status: 'Pending'
    });
    
    const savedRequest = await newRequest.save();
    
    // Populate hospital information
    await savedRequest.populate('hospitalId', 'name address');
    
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Error creating request:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT update request status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const updatedRequest = await Request.findOneAndUpdate(
      { id: id.toUpperCase() },
      { status },
      { new: true, runValidators: true }
    ).populate('hospitalId', 'name address');
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE request
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await Request.findOneAndUpdate(
      { id: id.toUpperCase() },
      { status: 'Cancelled' },
      { new: true, runValidators: true }
    );
    
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET nearby donors for a blood request (distance-based notification system)
router.get('/:requestId/nearby-donors', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { radius = 10 } = req.query; // Default 10km radius
    
    // Find the request and populate hospital details
    const request = await Request.findById(requestId)
      .populate('hospitalId', 'name address latitude longitude');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    if (!request.hospitalId) {
      return res.status(400).json({ message: 'Hospital information not found for this request' });
    }
    
    const hospital = request.hospitalId;
    
    // Import Donor model
    const Donor = require('../models/Donor');
    
    // Find all donors with matching blood group
    const matchingDonors = await Donor.find({
      bloodGroup: request.bloodGroup,
      isAvailable: true
    });
    
    // Calculate distance for each donor and filter by radius
    const nearbyDonors = matchingDonors
      .map(donor => {
        const distance = calculateDistance(
          hospital.latitude, hospital.longitude,
          donor.latitude, donor.longitude
        );
        return {
          ...donor.toObject(),
          distance: distance,
          isWithinRadius: distance <= radius
        };
      })
      .filter(donor => donor.isWithinRadius)
      .sort((a, b) => a.distance - b.distance); // Sort by distance (closest first)
    
    // Group donors by distance ranges for better organization
    const donorsByDistance = {
      within5km: nearbyDonors.filter(d => d.distance <= 5),
      within10km: nearbyDonors.filter(d => d.distance <= 10),
      total: nearbyDonors.length
    };
    
    res.json({
      request: {
        id: request.id,
        bloodGroup: request.bloodGroup,
        urgency: request.urgency,
        message: request.message,
        quantity: request.quantity
      },
      hospital: {
        name: hospital.name,
        address: hospital.address,
        coordinates: {
          latitude: hospital.latitude,
          longitude: hospital.longitude
        }
      },
      searchRadius: `${radius}km`,
      nearbyDonors: donorsByDistance,
      notificationPriority: 'Distance-based (closest donors notified first)'
    });
    
  } catch (error) {
    console.error('Error finding nearby donors:', error);
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
