// backend/routes/gemini.js
const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');

router.post('/', async (req, res) => {
  try {
    const answer = await geminiController.processGeminiRequest(req.body);
    res.json({ response: answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;