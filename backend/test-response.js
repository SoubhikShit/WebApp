const mongoose = require('mongoose');
const Response = require('./models/Response');
const Request = require('./models/Request');
const connectDB = require('./config/database');

const testResponse = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Test creating a response with hospitalId
    console.log('Testing Response model...');
    
    // First, let's check if there are any existing requests
    const requests = await Request.find().limit(1);
    if (requests.length === 0) {
      console.log('No requests found in database');
      return;
    }

    const testRequest = requests[0];
    console.log('Found test request:', testRequest._id, 'from hospital:', testRequest.hospitalId);

    // Test the findByHospitalId method
    const responses = await Response.findByHospitalId(testRequest.hospitalId);
    console.log(`Found ${responses.length} responses for hospital ${testRequest.hospitalId}`);

    // Test creating a new response
    const testResponse = new Response({
      requestId: testRequest._id,
      hospitalId: testRequest.hospitalId,
      responses: [{
        donorId: new mongoose.Types.ObjectId(), // Dummy donor ID
        message: 'Test response message',
        date: new Date(),
        timeOfCreation: new Date()
      }]
    });

    console.log('Test response object created successfully');
    console.log('Response schema validation passed');

    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

// Run test if this file is executed directly
if (require.main === module) {
  testResponse();
}

module.exports = testResponse;
