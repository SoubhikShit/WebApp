const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');

// GET /api/donors/test
router.get('/test', (req, res) => {
  res.json({ message: 'Donor routes are working!' });
});

// GET /api/donors
router.get('/', async (req, res) => {
  try {
    const donors = await Donor.find().sort({ name: 1 });
    res.json(donors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/donors/:id
router.get('/:id', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    console.error('Error fetching donor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
