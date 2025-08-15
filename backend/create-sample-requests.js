const mongoose = require('mongoose');
const Request = require('./models/Request');
const Hospital = require('./models/Hospital');
require('dotenv').config();

const createSampleRequests = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mybtp:mybtp@node-api.cqbp1.mongodb.net/?retryWrites=true&w=majority&appName=Node-API');
    console.log('✅ Connected to MongoDB');

    // Check if sample hospital exists, if not create one
    let sampleHospital = await Hospital.findOne({ id: 'SAMPLE' });
    if (!sampleHospital) {
      console.log('Creating sample hospital...');
      sampleHospital = new Hospital({
        id: 'SAMPLE',
        name: 'Sample General Hospital',
        password: 'password123',
        email: 'sample@hospital.com',
        phone: '+1-555-0123',
        address: {
          street: '123 Main Street',
          city: 'Sample City',
          state: 'Sample State',
          zipCode: '12345'
        },
        latitude: 40.7128,
        longitude: -74.0060
      });
      await sampleHospital.save();
      console.log('✅ Sample hospital created');
    }

    // Check if requests already exist
    const existingRequests = await Request.find({ hospitalId: sampleHospital._id });
    if (existingRequests.length > 0) {
      console.log('✅ Sample requests already exist');
      console.log('Available requests:', existingRequests.map(r => `${r.bloodGroup} - ${r.urgency}`));
      process.exit(0);
    }

    // Create sample blood requests for different blood groups
    const sampleRequests = [
      {
        id: 'REQ001',
        bloodGroup: 'A+',
        message: 'Urgent need for A+ blood for emergency surgery. Patient requires 4 units immediately.',
        urgency: 'Emergency',
        quantity: 4,
        hospitalId: sampleHospital._id,
        status: 'Pending'
      },
      {
        id: 'REQ002',
        bloodGroup: 'O+',
        message: 'Regular blood drive for O+ donors. Need 10 units for upcoming procedures.',
        urgency: 'Medium',
        quantity: 10,
        hospitalId: sampleHospital._id,
        status: 'Pending'
      },
      {
        id: 'REQ003',
        bloodGroup: 'B+',
        message: 'High priority request for B+ blood. Trauma patient needs 6 units.',
        urgency: 'High',
        quantity: 6,
        hospitalId: sampleHospital._id,
        status: 'Pending'
      },
      {
        id: 'REQ004',
        bloodGroup: 'AB+',
        message: 'Rare blood type needed. Patient with AB+ requires 2 units for surgery.',
        urgency: 'High',
        quantity: 2,
        hospitalId: sampleHospital._id,
        status: 'Pending'
      },
      {
        id: 'REQ005',
        bloodGroup: 'A-',
        message: 'A- blood needed for pediatric patient. Requires 3 units.',
        urgency: 'Medium',
        quantity: 3,
        hospitalId: sampleHospital._id,
        status: 'Pending'
      },
      {
        id: 'REQ006',
        bloodGroup: 'O-',
        message: 'Universal donor blood needed for emergency. Critical situation requires 5 units.',
        urgency: 'Emergency',
        quantity: 5,
        hospitalId: sampleHospital._id,
        status: 'Pending'
      }
    ];

    // Save all requests
    for (const requestData of sampleRequests) {
      const newRequest = new Request(requestData);
      await newRequest.save();
      console.log(`✅ Created request: ${requestData.bloodGroup} - ${requestData.urgency}`);
    }

    console.log('\n🎉 All sample blood requests created successfully!');
    console.log('You can now test the donor alerts functionality with different blood types.');

  } catch (error) {
    console.error('❌ Error creating sample requests:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createSampleRequests();
