// backend/routes/claude.js
const express = require('express');
const router = express.Router();
const claudeController = require('../controllers/claudeController');

router.post('/', async (req, res) => {
  try {
    const answer = await claudeController.processClaudeRequest(req.body);
    res.json({ response: answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;