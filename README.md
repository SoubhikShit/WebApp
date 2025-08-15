# Blood Warriors - Hospital & Donor Blood Donation Platform

Welcome to Blood Warriors, a web application designed to connect hospitals with eligible blood donors based on location proximity and blood type compatibility.

## Table of Contents

1.  [Features](#features)
2.  [Prerequisites](#prerequisites)
3.  [Getting Started](#getting-started)
    *   [1. Clone the Repository](#1-clone-the-repository)
    *   [2. Backend Setup](#2-backend-setup)
    *   [3. Frontend Setup](#3-frontend-setup)
    *   [4. Populate Database with Sample Data](#4-populate-database-with-sample-data)
    *   [5. Run the Application](#5-run-the-application)
4.  [Understanding the Location-Based System](#understanding-the-location-based-system)
5.  [Sample User Credentials](#sample-user-credentials)
6.  [Key API Endpoints](#key-api-endpoints)

## Features

*   **Hospital Registration & Login:** Hospitals can create accounts and log in securely.
*   **Donor Registration & Login:** Donors can create accounts and log in securely, providing their blood group and address (including location coordinates).
*   **Blood Request Management (Hospital):** Hospitals can create, view, and manage blood requests.
*   **Distance-Based Donor Alerts (Donor):** Donors receive alerts for blood requests from hospitals within a 10km radius that match their blood type. The distance is calculated using the donor's registered latitude and longitude.
*   **Donor Response System:** Donors can respond to blood requests.
*   **Response Prioritization (Hospital):** Hospitals can view donor responses, prioritized by the donor's proximity to the hospital.
*   **User Authentication & Authorization:** Secure login and access control for different user types.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js (LTS version recommended):** Includes npm (Node Package Manager).
    *   [Download Node.js](https://nodejs.org/en/download/)
*   **MongoDB Atlas Account:** A cloud-hosted MongoDB database.
    *   [Create a MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register)
    *   Ensure your MongoDB connection string is updated in `backend/.env` (or directly in `backend/config/database.js` and `backend/test.js` / `backend/create-location-based-data.js`).

## Getting Started

Follow these steps to get the Blood Warriors application up and running on your local machine.

### 1. Clone the Repository

```bash
git clone <repository_url>
cd WebApp
```

### 2. Backend Setup

Navigate to the `backend` directory, install dependencies, and set up your environment variables.

```bash
cd backend
npm install
```

**MongoDB Connection String:**
Update the `MONGODB_URI` in `backend/test.js` and `backend/create-location-based-data.js` to your MongoDB Atlas connection string. You might also want to set it up in a `.env` file if not already present, and use `dotenv` in `server.js` and other relevant files.

```javascript
// Example in backend/test.js and backend/create-location-based-data.js
const MONGODB_URI = 'mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority&appName=Node-API';
```

### 3. Frontend Setup

Open a **new terminal window**, navigate to the `frontend` directory, and install dependencies.

```bash
cd frontend
npm install
```

### 4. Populate Database with Sample Data

This step will clear any existing data in your MongoDB collections (Donors, Hospitals, Requests, Responses) and insert new sample data, including donors with specific blood types and locations relative to the sample hospitals. This is crucial for testing the distance-based filtering.

*   In your **backend terminal window** (where you are in the `backend` directory), run:
    ```bash
    node create-location-based-data.js
    ```
    Wait for the script to finish and confirm "Sample data insertion completed successfully!".

### 5. Run the Application

You need to run both the backend API server and the frontend development server simultaneously.

*   **In your backend terminal window** (where you are in the `backend` directory), run:
    ```bash
    node server.js
    ```
    This will start the backend API on `http://localhost:5000`.

*   **In your frontend terminal window** (where you are in the `frontend` directory), run:
    ```bash
    npm run dev
    ```
    This will start the frontend development server, usually on `http://localhost:5173`.

Once both servers are running, open your browser and navigate to `http://localhost:5173`.

## Understanding the Location-Based System

The application implements a proximity-based notification system for donors:

*   **Donor Location:** The frontend (`frontend/src/pages/donor/Alerts.jsx`) uses the `latitude` and `longitude` stored in the donor's profile (from the database) to determine their location.
*   **Distance Calculation:** When a donor views alerts, the frontend sends their profile's coordinates to the backend (`backend/routes/requests.js`). The backend then calculates the distance between the donor and each hospital that has a blood request, using the Haversine formula.
*   **Filtering:** Only blood requests from hospitals within a **10km radius** of the donor's profile location *and* matching the donor's **blood type** are displayed.
*   **Response Prioritization:** When a hospital views responses to their requests, donor responses are prioritized based on the donor's proximity to the hospital.

## Sample User Credentials

You can use these credentials to test the application after populating the database:

### Hospitals

*   **Apollo Hospital, Delhi (HOSP001)**
    *   Email: `info@apollodelhi.com`
    *   Password: `password123`
*   **Fortis Hospital, Mumbai (HOSP002)**
    *   Email: `contact@fortismumbai.com`
    *   Password: `password123`
*   **Manipal Hospital, Bangalore (HOSP003)**
    *   Email: `info@manipalbangalore.com`
    *   Password: `password123`

### Donors

*   **Rahul Sharma (DONOR001)** (Blood Group: O+, Near Apollo Hospital, Delhi)
    *   Email: `rahul.sharma@email.com`
    *   Password: `password123`
*   **Priya Patel (DONOR002)** (Blood Group: A-, Near Apollo Hospital, Delhi)
    *   Email: `priya.patel@email.com`
    *   Password: `password123`
*   **Amit Kumar (DONOR003)** (Blood Group: B+, Near Apollo Hospital, Delhi)
    *   Email: `amit.kumar@email.com`
    *   Password: `password123`
*   **Neha Singh (DONOR004)** (Blood Group: O-, Far from Fortis Hospital, Mumbai)
    *   Email: `neha.singh@email.com`
    *   Password: `password123`
*   **Vikram Mehta (DONOR005)** (Blood Group: AB+, Near Fortis Hospital, Mumbai)
    *   Email: `vikram.mehta@email.com`
    *   Password: `password123`
*   **Kavya Reddy (DONOR006)** (Blood Group: A+, Near Manipal Hospital, Bangalore)
    *   Email: `kavya.reddy@email.com`
    *   Password: `password123`
*   **Arjun Nair (DONOR007)** (Blood Group: B-, Near Manipal Hospital, Bangalore)
    *   Email: `arjun.nair@email.com`
    *   Password: `password123`

## Key API Endpoints

**Backend (Port 5000):**

*   `GET /` - Basic API welcome message
*   `GET /health` - API health check
*   `POST /api/auth/register/donor` - Register a new donor
*   `POST /api/auth/register/hospital` - Register a new hospital
*   `POST /api/auth/login` - User login
*   `GET /api/donors` - Get all donors (admin/testing)
*   `GET /api/hospitals` - Get all hospitals (admin/testing)
*   `GET /api/requests/donor/:bloodGroup?lat=<lat>&lng=<lng>&maxDistance=<dist>` - Get blood requests for a donor (filtered by blood group and proximity)
*   `POST /api/requests` - Create a new blood request (hospital)
*   `GET /api/requests/hospital/:hospitalId` - Get requests by hospital
*   `GET /api/responses/request/:requestId/prioritized` - Get donor responses for a request, prioritized by distance (hospital)
*   `POST /api/responses` - Donor submits a response to a request

**Frontend (Port 5173):**

*   `http://localhost:5173` - Main application entry point
*   Routes for donor/hospital dashboards, login, signup, alerts, profile etc.

This `README.md` should be comprehensive enough for anyone (including yourself!) to understand and run the project easily. Let me know if you'd like any adjustments!
