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
      { id },
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
    const deletedRequest = await Request.findOneAndDelete({ id });
    
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
