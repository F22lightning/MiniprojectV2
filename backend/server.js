require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow requests from our frontend
app.use(express.json()); // Parse JSON request bodies

// Simple health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running!' });
});

// Root route to prevent "Cannot GET /"
app.get('/', (req, res) => {
    res.send('Kitchen Buddy API is running. Access endpoints via /api');
});

// Import API routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
