const express = require('express');
const router = express.Router();
const llmController = require('../controllers/llmController');

// Route to handle chat completions
router.post('/chat', llmController.chatHandler);

// Route to test LLM configuration
router.post('/test-config', llmController.testConfigHandler);

module.exports = router;
