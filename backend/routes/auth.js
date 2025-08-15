const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');

// JWT Secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  body('phone').trim().notEmpty(),
  body('address.street').trim().notEmpty(),
  body('address.city').trim().notEmpty(),
  body('address.state').trim().notEmpty(),
  body('address.zipCode').trim().notEmpty(),
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 })
];

const validateDonorRegistration = [
  ...validateRegistration,
  body('age').isInt({ min: 18, max: 65 }),
  body('gender').isIn(['Male', 'Female', 'Other']),
  body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Helper function to generate JWT token
const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// POST /api/auth/register/donor
router.post('/register/donor', validateDonorRegistration, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      id, name, age, gender, email, password, phone,
      address, latitude, longitude, bloodGroup
    } = req.body;

    // Check if donor already exists
    const existingDonor = await Donor.findOne({ 
      $or: [{ email }, { id }] 
    });
    
    if (existingDonor) {
      return res.status(400).json({ 
        message: 'Donor with this email or ID already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new donor
    const newDonor = new Donor({
      id: id.toUpperCase(),
      name,
      age,
      gender,
      email,
      password: hashedPassword,
      phone,
      address,
      latitude,
      longitude,
      bloodGroup
    });

    const savedDonor = await newDonor.save();
    
    // Generate token
    const token = generateToken(savedDonor._id, 'donor');

    // Remove password from response
    const donorResponse = savedDonor.toObject();
    delete donorResponse.password;

    res.status(201).json({
      message: 'Donor registered successfully',
      donor: donorResponse,
      token
    });

  } catch (error) {
    console.error('Error registering donor:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/register/hospital
router.post('/register/hospital', validateRegistration, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      id, name, email, password, phone, address, latitude, longitude
    } = req.body;

    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({ 
      $or: [{ email }, { id }] 
    });
    
    if (existingHospital) {
      return res.status(400).json({ 
        message: 'Hospital with this email or ID already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new hospital
    const newHospital = new Hospital({
      id: id.toUpperCase(),
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      latitude,
      longitude
    });

    const savedHospital = await newHospital.save();
    
    // Generate token
    const token = generateToken(savedHospital._id, 'hospital');

    // Remove password from response
    const hospitalResponse = savedHospital.toObject();
    delete hospitalResponse.password;

    res.status(201).json({
      message: 'Hospital registered successfully',
      hospital: hospitalResponse,
      token
    });

  } catch (error) {
    console.error('Error registering hospital:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/login/donor
router.post('/login/donor', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find donor by email
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, donor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(donor._id, 'donor');

    // Remove password from response
    const donorResponse = donor.toObject();
    delete donorResponse.password;

    res.json({
      message: 'Login successful',
      donor: donorResponse,
      token
    });

  } catch (error) {
    console.error('Error logging in donor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/login/hospital
router.post('/login/hospital', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find hospital by email
    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, hospital.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(hospital._id, 'hospital');

    // Remove password from response
    const hospitalResponse = hospital.toObject();
    delete hospitalResponse.password;

    res.json({
      message: 'Login successful',
      hospital: hospitalResponse,
      token
    });

  } catch (error) {
    console.error('Error logging in hospital:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/auth/verify - Verify JWT token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ 
      valid: true, 
      userId: decoded.userId, 
      userType: decoded.userType 
    });

  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// GET /api/auth/test
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!' });
});

module.exports = router;
