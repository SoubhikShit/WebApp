# BloodWarriors Backend

Express.js backend server for the BloodWarriors blood donation application.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://mybtp:mybtp@node-api.cqbp1.mongodb.net/?retryWrites=true&w=majority&appName=Node-API

# JWT Configuration (for future use)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. Run the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## Available Endpoints

### Base Routes
- `GET /` - Server status
- `GET /health` - Health check

### API Routes
- `GET /api/auth/test` - Test auth routes
- `POST /api/auth/login` - User login (to be implemented)
- `POST /api/auth/register` - User registration (to be implemented)

- `GET /api/donors/test` - Test donor routes
- `GET /api/donors` - Get all donors (to be implemented)
- `GET /api/donors/:id` - Get donor by ID (to be implemented)

- `GET /api/hospitals/test` - Test hospital routes
- `GET /api/hospitals` - Get all hospitals (to be implemented)
- `GET /api/hospitals/:id` - Get hospital by ID (to be implemented)

- `GET /api/blood-banks/test` - Test blood bank routes
- `GET /api/blood-banks` - Get all blood banks (to be implemented)
- `GET /api/blood-banks/:id` - Get blood bank by ID (to be implemented)

## Project Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── config/            # Configuration files
│   └── database.js   # MongoDB connection configuration
├── models/            # Mongoose data models
│   ├── Hospital.js   # Hospital data model
│   ├── Donor.js      # Donor data model
│   └── index.js      # Model exports
├── routes/            # API route handlers
│   ├── auth.js       # Authentication routes
│   ├── donors.js     # Donor management routes
│   ├── hospitals.js  # Hospital management routes
│   └── bloodBanks.js # Blood bank management routes
└── README.md         # This file
```

## Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **mongoose** - MongoDB ODM (Atlas Cloud Database)
- **bcryptjs** - Password hashing (for future use)
- **jsonwebtoken** - JWT authentication (for future use)
- **express-validator** - Input validation (for future use)

## Data Models

### Hospital Model
- **Unique ID**: id (unique identifier)
- **Login**: password
- **Basic Info**: name
- **Contact**: email (unique), phone
- **Address**: street, city, state, zipCode
- **Location**: latitude, longitude (with geospatial indexing)

### Donor Model
- **Unique ID**: id (unique identifier)
- **Authentication**: password
- **Personal**: name, age, gender, bloodGroup
- **Contact**: email, phone
- **Address**: street, city, state, zipCode
- **Location**: latitude, longitude (with geospatial indexing)
- **Donation**: numberOfTimesDonated, lastDonated

### Features
- **Geospatial Queries**: Find nearby hospitals/donors
- **Validation**: Comprehensive field validation
- **Virtual Fields**: BMI, distance calculations, donation eligibility
- **Indexing**: Optimized for location and blood group queries

## Development

The server runs on port 5000 by default. You can change this by setting the `PORT` environment variable.

For development, the server will automatically restart when you make changes to the code (using nodemon).
