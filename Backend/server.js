const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.path}`);
  next();
});

// Import API routes from the routes directory
const chatgptRouter = require('./routes/chatgpt');
const GEMINIRouter = require('./routes/GEMINI');
const claudeRouter = require('./routes/claude');

// Define API endpoints
app.use('/api/chatgpt', chatgptRouter);
app.use('/api/GEMINI', GEMINIRouter);
app.use('/api/claude', claudeRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables loaded:', {
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    CLAUDE_API_KEY: !!process.env.CLAUDE_API_KEY,
    FRONTEND_URL: process.env.FRONTEND_URL || 'Not set (using fallback)'
  });
});

module.exports = app;