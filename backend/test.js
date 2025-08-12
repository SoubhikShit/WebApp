const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Donor, Hospital, Request } = require('./models');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://mybtp:mybtp@node-api.cqbp1.mongodb.net/?retryWrites=true&w=majority&appName=Node-API';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Sample data
const sampleData = {
  donors: [
    {
      id: 'DONOR001',
      name: 'John Smith',
      age: 28,
      gender: 'Male',
      email: 'john.smith@email.com',
      password: 'password123',
      phone: '15551234567',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      latitude: 40.7128,
      longitude: -74.0060,
      bloodGroup: 'O+',
      numberOfTimesDonated: 3,
      lastDonated: new Date('2024-01-15')
    },
    {
      id: 'DONOR002',
      name: 'Sarah Johnson',
      age: 32,
      gender: 'Female',
      email: 'sarah.johnson@email.com',
      password: 'password123',
      phone: '15559876543',
      address: {
        street: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210'
      },
      latitude: 34.0522,
      longitude: -118.2437,
      bloodGroup: 'A-',
      numberOfTimesDonated: 5,
      lastDonated: new Date('2024-02-01')
    }
  ],
  
  hospitals: [
    {
      id: 'HOSP001',
      name: 'City General Hospital',
      password: 'password123',
      email: 'info@citygeneral.com',
      phone: '15551112222',
      address: {
        street: '789 Medical Center Drive',
        city: 'New York',
        state: 'NY',
        zipCode: '10002'
      },
      latitude: 40.7589,
      longitude: -73.9851
    },
    {
      id: 'HOSP002',
      name: 'Regional Medical Center',
      password: 'password123',
      email: 'contact@regionalmed.com',
      phone: '15553334444',
      address: {
        street: '321 Healthcare Boulevard',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90211'
      },
      latitude: 34.0736,
      longitude: -118.4004
    }
  ],
  
  requests: [
    {
      id: 'REQ001',
      bloodGroup: 'O+',
      message: 'Urgent need for O+ blood. Multiple trauma cases admitted. Please donate if eligible.',
      urgency: 'Emergency',
      status: 'Pending',
      quantity: 10
    },
    {
      id: 'REQ002',
      bloodGroup: 'A-',
      message: 'Scheduled surgeries requiring A- blood. Your donation can help save lives.',
      urgency: 'High',
      status: 'Pending',
      quantity: 5
    }
  ]
};

// Function to hash passwords
async function hashPasswords() {
  for (let donor of sampleData.donors) {
    donor.password = await bcrypt.hash(donor.password, 10);
  }
  
  for (let hospital of sampleData.hospitals) {
    hospital.password = await bcrypt.hash(hospital.password, 10);
  }
}

// Function to insert sample data
async function insertSampleData() {
  try {
    console.log('🗑️  Clearing existing data...');
    
    // Clear existing data
    await Donor.deleteMany({});
    await Hospital.deleteMany({});
    await Request.deleteMany({});
    
    console.log('✅ Existing data cleared');
    
    // Hash passwords
    console.log('🔐 Hashing passwords...');
    await hashPasswords();
    
    // Insert donors
    console.log('👥 Inserting donors...');
    const insertedDonors = await Donor.insertMany(sampleData.donors);
    console.log(`✅ ${insertedDonors.length} donors inserted`);
    
    // Insert hospitals
    console.log('🏥 Inserting hospitals...');
    const insertedHospitals = await Hospital.insertMany(sampleData.hospitals);
    console.log(`✅ ${insertedHospitals.length} hospitals inserted`);
    
    // Insert requests (with hospital references)
    console.log('🩸 Inserting blood requests...');
    const requestsWithHospitalIds = sampleData.requests.map((request, index) => ({
      ...request,
      hospitalId: insertedHospitals[index]._id
    }));
    
    const insertedRequests = await Request.insertMany(requestsWithHospitalIds);
    console.log(`✅ ${insertedRequests.length} requests inserted`);
    
    console.log('\n🎉 Sample data insertion completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Donors: ${insertedDonors.length}`);
    console.log(`   • Hospitals: ${insertedHospitals.length}`);
    console.log(`   • Requests: ${insertedRequests.length}`);
    
    // Display inserted data
    console.log('\n📋 Inserted Data:');
    
    console.log('\n👥 Donors:');
    insertedDonors.forEach(donor => {
      console.log(`   • ${donor.name} (${donor.id}) - ${donor.bloodGroup} - ${donor.address.city}, ${donor.address.state}`);
    });
    
    console.log('\n🏥 Hospitals:');
    insertedHospitals.forEach(hospital => {
      console.log(`   • ${hospital.name} (${hospital.id}) - ${hospital.address.city}, ${hospital.address.state}`);
    });
    
    console.log('\n🩸 Blood Requests:');
    insertedRequests.forEach(request => {
      console.log(`   • ${request.id} - ${request.bloodGroup} - ${request.urgency} - Qty: ${request.quantity}`);
    });
    
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
console.log('🚀 Starting sample data insertion...');
insertSampleData();
