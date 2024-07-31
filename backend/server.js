// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

// Load environment variables
require('dotenv').config();

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to database
connectDB();

// Routes
app.use('/tasks', taskRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
