// backend/routes/chatgpt.js
const express = require('express');
const router = express.Router();
const chatgptController = require('../controllers/chatgptController');

router.post('/', async (req, res) => {
  try {
    const answer = await chatgptController.processChatGPTRequest(req.body);
    res.json({ response: answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
