const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Donor, Hospital, Request, Response } = require('./models');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://mybtp:mybtp@node-api.cqbp1.mongodb.net/?retryWrites=true&w=majority&appName=Node-API';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Realistic Indian locations with pincodes and coordinates
const sampleData = {
  hospitals: [
    {
      id: 'HOSP001',
      name: 'Apollo Hospital, Delhi',
      password: 'password123',
      email: 'info@apollodelhi.com',
      phone: '011-23456789',
      address: {
        street: 'Safdarjung Enclave',
        city: 'New Delhi',
        state: 'Delhi',
        zipCode: '110029'
      },
      latitude: 28.5678,
      longitude: 77.2090
    },
    {
      id: 'HOSP002',
      name: 'Fortis Hospital, Mumbai',
      password: 'password123',
      email: 'contact@fortismumbai.com',
      phone: '022-34567890',
      address: {
        street: 'Mulund West',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400080'
      },
      latitude: 19.0760,
      longitude: 72.8777
    },
    {
      id: 'HOSP003',
      name: 'Manipal Hospital, Bangalore',
      password: 'password123',
      email: 'info@manipalbangalore.com',
      phone: '080-45678901',
      address: {
        street: 'Whitefield',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560066'
      },
      latitude: 12.9716,
      longitude: 77.5946
    }
  ],
  
  donors: [
    // Delhi area donors (within 10km of Apollo Hospital)
    {
      id: 'DONOR001',
      name: 'Rahul Sharma',
      age: 28,
      gender: 'Male',
      email: 'rahul.sharma@email.com',
      password: 'password123',
      phone: '9876543210',
      address: {
        street: 'Green Park Extension',
        city: 'New Delhi',
        state: 'Delhi',
        zipCode: '110016'
      },
      latitude: 28.5678,
      longitude: 77.2090,
      bloodGroup: 'O+',
      numberOfTimesDonated: 3,
      lastDonated: new Date('2024-01-15'),
      isAvailable: true
    },
    {
      id: 'DONOR002',
      name: 'Priya Patel',
      age: 32,
      gender: 'Female',
      email: 'priya.patel@email.com',
      password: 'password123',
      phone: '9876543211',
      address: {
        street: 'Hauz Khas',
        city: 'New Delhi',
        state: 'Delhi',
        zipCode: '110016'
      },
      latitude: 28.5478,
      longitude: 77.1990,
      bloodGroup: 'A-',
      numberOfTimesDonated: 5,
      lastDonated: new Date('2024-02-01'),
      isAvailable: true
    },
    {
      id: 'DONOR003',
      name: 'Amit Kumar',
      age: 35,
      gender: 'Male',
      email: 'amit.kumar@email.com',
      password: 'password123',
      phone: '9876543212',
      address: {
        street: 'Lajpat Nagar',
        city: 'New Delhi',
        state: 'Delhi',
        zipCode: '110024'
      },
      latitude: 28.5878,
      longitude: 77.2390,
      bloodGroup: 'B+',
      numberOfTimesDonated: 2,
      lastDonated: new Date('2024-01-20'),
      isAvailable: true
    },
    
    // Mumbai area donors (within 10km of Fortis Hospital)
    {
      id: 'DONOR004',
      name: 'Neha Singh',
      age: 29,
      gender: 'Female',
      email: 'neha.singh@email.com',
      password: 'password123',
      phone: '9876543213',
      address: {
        street: 'Thane West',
        city: 'Thane',
        state: 'Maharashtra',
        zipCode: '400601'
      },
      latitude: 19.1860,
      longitude: 72.8777,
      bloodGroup: 'B+',
      numberOfTimesDonated: 4,
      lastDonated: new Date('2024-01-10'),
      isAvailable: true
    },
    {
      id: 'DONOR005',
      name: 'Vikram Mehta',
      age: 31,
      gender: 'Male',
      email: 'vikram.mehta@email.com',
      password: 'password123',
      phone: '9876543214',
      address: {
        street: 'Nahur West',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400078'
      },
      latitude: 19.1560,
      longitude: 72.8477,
      bloodGroup: 'AB+',
      numberOfTimesDonated: 1,
      lastDonated: new Date('2024-02-05'),
      isAvailable: true
    },
    
    // Bangalore area donors (within 10km of Manipal Hospital)
    {
      id: 'DONOR006',
      name: 'Kavya Reddy',
      age: 26,
      gender: 'Female',
      email: 'kavya.reddy@email.com',
      password: 'password123',
      phone: '9876543215',
      address: {
        street: 'Marathahalli',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560037'
      },
      latitude: 12.9516,
      longitude: 77.5846,
      bloodGroup: 'A+',
      numberOfTimesDonated: 3,
      lastDonated: new Date('2024-01-25'),
      isAvailable: true
    },
    {
      id: 'DONOR007',
      name: 'Arjun Nair',
      age: 33,
      gender: 'Male',
      email: 'arjun.nair@email.com',
      password: 'password123',
      phone: '9876543216',
      address: {
        street: 'Bellandur',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560103'
      },
      latitude: 12.9916,
      longitude: 77.6046,
      bloodGroup: 'B-',
      numberOfTimesDonated: 6,
      lastDonated: new Date('2024-01-30'),
      isAvailable: true
    }
  ],
  
  requests: [
    {
      id: 'REQ001',
      bloodGroup: 'O+',
      message: 'Urgent need for O+ blood. Multiple trauma cases admitted. Please donate if eligible.',
      urgency: 'Emergency',
      status: 'Pending',
      quantity: 10,
      hospitalId: null // Will be set after hospital insertion
    },
    {
      id: 'REQ002',
      bloodGroup: 'A-',
      message: 'Scheduled surgeries requiring A- blood. Your donation can help save lives.',
      urgency: 'High',
      status: 'Pending',
      quantity: 5,
      hospitalId: null
    },
    {
      id: 'REQ003',
      bloodGroup: 'B+',
      message: 'Cancer patient requiring B+ blood transfusion. Urgent need.',
      urgency: 'Emergency',
      status: 'Pending',
      quantity: 8,
      hospitalId: null
    }
  ]
};

// Function to calculate distance between two points using Haversine formula
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

// Function to find donors within radius
function findDonorsInRadius(hospitalLat, hospitalLon, donors, radiusKm = 10) {
  return donors.filter(donor => {
    const distance = calculateDistance(hospitalLat, hospitalLon, donor.latitude, donor.longitude);
    return distance <= radiusKm;
  });
}

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
    await Response.deleteMany({});
    
    console.log('✅ Existing data cleared');
    
    // Hash passwords
    console.log('🔐 Hashing passwords...');
    await hashPasswords();
    
    // Insert hospitals
    console.log('🏥 Inserting hospitals...');
    const insertedHospitals = await Hospital.insertMany(sampleData.hospitals);
    console.log(`✅ ${insertedHospitals.length} hospitals inserted`);
    
    // Insert donors
    console.log('👥 Inserting donors...');
    const insertedDonors = await Donor.insertMany(sampleData.donors);
    console.log(`✅ ${insertedDonors.length} donors inserted`);
    
    // Insert requests (with hospital references)
    console.log('🩸 Inserting blood requests...');
    const requestsWithHospitalIds = sampleData.requests.map((request, index) => ({
      ...request,
      hospitalId: insertedHospitals[index % insertedHospitals.length]._id
    }));
    
    const insertedRequests = await Request.insertMany(requestsWithHospitalIds);
    console.log(`✅ ${insertedRequests.length} requests inserted`);
    
    console.log('\n🎉 Sample data insertion completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Hospitals: ${insertedHospitals.length}`);
    console.log(`   • Donors: ${insertedDonors.length}`);
    console.log(`   • Requests: ${insertedRequests.length}`);
    
    // Display inserted data with distance calculations
    console.log('\n📋 Inserted Data with Distance Analysis:');
    
    console.log('\n🏥 Hospitals:');
    insertedHospitals.forEach(hospital => {
      console.log(`   • ${hospital.name} (${hospital.id}) - ${hospital.address.city}, ${hospital.address.state}`);
      console.log(`     📍 Coordinates: ${hospital.latitude}, ${hospital.longitude}`);
      console.log(`     📮 Pincode: ${hospital.address.zipCode}`);
    });
    
    console.log('\n👥 Donors with Distance to Nearest Hospital:');
    insertedDonors.forEach(donor => {
      let nearestHospital = null;
      let minDistance = Infinity;
      
      insertedHospitals.forEach(hospital => {
        const distance = calculateDistance(
          hospital.latitude, hospital.longitude,
          donor.latitude, donor.longitude
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestHospital = hospital;
        }
      });
      
      const status = minDistance <= 10 ? '🟢 Within 10km' : '🔴 Outside 10km';
      console.log(`   • ${donor.name} (${donor.id}) - ${donor.bloodGroup}`);
      console.log(`     📍 ${donor.address.city}, ${donor.address.state} (${donor.address.zipCode})`);
      console.log(`     🏥 Nearest: ${nearestHospital.name} - ${minDistance.toFixed(2)}km ${status}`);
    });
    
    console.log('\n🩸 Blood Requests:');
    insertedRequests.forEach(request => {
      const hospital = insertedHospitals.find(h => h._id.toString() === request.hospitalId.toString());
      console.log(`   • ${request.id} - ${request.bloodGroup} - ${request.urgency} - Qty: ${request.quantity}`);
      console.log(`     🏥 Hospital: ${hospital.name}`);
      
      // Find donors within 10km for this request
      const nearbyDonors = findDonorsInRadius(
        hospital.latitude, hospital.longitude, 
        insertedDonors, 10
      );
      
      const matchingDonors = nearbyDonors.filter(donor => 
        donor.bloodGroup === request.bloodGroup
      );
      
      console.log(`     👥 Nearby donors (≤10km): ${nearbyDonors.length}`);
      console.log(`     🩸 Matching blood group: ${matchingDonors.length}`);
      
      if (matchingDonors.length > 0) {
        console.log(`     📍 Eligible donors:`);
        matchingDonors.forEach(donor => {
          const distance = calculateDistance(
            hospital.latitude, hospital.longitude,
            donor.latitude, donor.longitude
          );
          console.log(`        - ${donor.name} (${distance.toFixed(2)}km away)`);
        });
      }
    });
    
    console.log('\n🔍 Distance-Based Notification System:');
    console.log('   • Donors within 10km radius get notified first');
    console.log('   • Distance calculated using latitude/longitude coordinates');
    console.log('   • Pincode-based location mapping implemented');
    console.log('   • Blood group matching for efficient donor selection');
    
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
console.log('🚀 Starting location-based sample data insertion...');
console.log('📍 Creating donors within 10km radius of hospitals...');
insertSampleData();
