const mongoose = require('mongoose');
const Response = require('./models/Response');
const Request = require('./models/Request');
const connectDB = require('./config/database');

const migrateResponses = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Find all responses that don't have hospitalId
    const responsesWithoutHospitalId = await Response.find({ hospitalId: { $exists: false } });
    console.log(`Found ${responsesWithoutHospitalId.length} responses without hospitalId`);

    for (const response of responsesWithoutHospitalId) {
      try {
        // Find the request to get hospitalId
        const request = await Request.findById(response.requestId);
        if (request && request.hospitalId) {
          // Update the response with hospitalId
          await Response.findByIdAndUpdate(response._id, { hospitalId: request.hospitalId });
          console.log(`Updated response ${response._id} with hospitalId ${request.hospitalId}`);
        } else {
          console.log(`Could not find request or hospitalId for response ${response._id}`);
        }
      } catch (error) {
        console.error(`Error updating response ${response._id}:`, error);
      }
    }

    console.log('Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateResponses();
}

module.exports = migrateResponses;
