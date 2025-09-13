const axios = require('axios');

// Handles testing the LLM configuration
const testConfigHandler = async (req, res) => {
  const { baseUrl, apiKey, model } = req.body;

  if (!baseUrl || !apiKey || !model) {
    return res.status(400).json({ success: false, message: 'Missing LLM configuration details.' });
  }

  try {
    // Make a lightweight request to the LLM's base URL to check for validity.
    // A common approach is to fetch models or just perform a HEAD request if the API supports it.
    // We'll try a POST with no messages, as many APIs will reject this with a 400/422
    // but not a 401/403/404 if the auth/URL is correct. This is a decent heuristic.
    await axios.post(baseUrl, {}, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    // If the above doesn't throw, it's likely a misconfigured but reachable server.
    // The real test is a successful error response for a bad request.
    res.status(200).json({ success: true, message: 'Configuration seems valid. The server responded.' });

  } catch (error) {
    if (error.response) {
      // e.g., 401 Unauthorized, 404 Not Found
      if (error.response.status === 401 || error.response.status === 403) {
        return res.status(200).json({ success: false, message: 'Authentication failed. Check your API Key.' });
      }
      // If we get a validation error (e.g., 400, 422), it means we reached the server
      // and it understood the request, so the config is likely correct.
      if (error.response.status === 400 || error.response.status === 422) {
        return res.status(200).json({ success: true, message: 'Configuration is valid. The server was reached successfully.' });
      }
      return res.status(200).json({ success: false, message: `Server responded with status ${error.response.status}. Check Base URL.` });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(200).json({ success: false, message: 'The request timed out or the server is unreachable. Check Base URL.' });
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({ success: false, message: `An internal error occurred: ${error.message}` });
    }
  }
};

// Handles the main chat interaction
const chatHandler = async (req, res) => {
  const { baseUrl, apiKey, model, messages } = req.body;

  if (!baseUrl || !apiKey || !model || !messages) {
    return res.status(400).json({ success: false, message: 'Missing required parameters for chat.' });
  }

  try {
    // This is a proxy. It forwards the request to the actual LLM service.
    const response = await axios.post(baseUrl, {
      model: model,
      messages: messages,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json(response.data);

  } catch (error) {
    console.error('Error proxying to LLM API:', error.message);
    // Forward the status and error message from the external API if available
    if (error.response) {
      res.status(error.response.status).json({
        success: false,
        message: 'Error from external LLM API.',
        error: error.response.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error while contacting LLM API.',
        error: error.message
      });
    }
  }
};

module.exports = {
  testConfigHandler,
  chatHandler
};
