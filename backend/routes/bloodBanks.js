const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// GET /api/blood-banks/test
router.get('/test', (req, res) => {
  res.json({ message: 'Blood bank routes are working!' });
});

// GET /api/blood-banks
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ name: 1 });
    res.json(hospitals);
  } catch (error) {
    console.error('Error fetching blood banks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/blood-banks/:id
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Blood bank not found' });
    }
    res.json(hospital);
  } catch (error) {
    console.error('Error fetching blood bank:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
