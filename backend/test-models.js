const mongoose = require('mongoose');

console.log('🧪 Testing model loading...');

try {
  // Test loading models
  console.log('📦 Loading Donor model...');
  const Donor = require('./models/Donor');
  console.log('✅ Donor model loaded successfully');
  
  console.log('📦 Loading Hospital model...');
  const Hospital = require('./models/Hospital');
  console.log('✅ Hospital model loaded successfully');
  
  console.log('📦 Loading Request model...');
  const Request = require('./models/Request');
  console.log('✅ Request model loaded successfully');
  
  console.log('📦 Loading models index...');
  const models = require('./models');
  console.log('✅ Models index loaded successfully');
  
  console.log('📋 Available models:', Object.keys(models));
  
  console.log('\n🎉 All models loaded successfully!');
  
} catch (error) {
  console.error('❌ Error loading models:', error.message);
  console.error('Stack trace:', error.stack);
}

process.exit(0);
