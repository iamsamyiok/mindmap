import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Our backend server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Tests the provided LLM configuration by sending it to the backend.
 * @param {object} config - The LLM configuration.
 * @param {string} config.baseUrl - The base URL of the LLM service.
 * @param {string} config.apiKey - The API key for the LLM service.
 * @param {string} config.model - The model name to use.
 * @returns {Promise<object>} The result of the test.
 */
export const testLlmConfig = async (config) => {
  try {
    const response = await apiClient.post('/test-config', config);
    return { success: true, message: response.data.message };
  } catch (error) {
    const message = error.response?.data?.message || 'An unknown error occurred.';
    return { success: false, message };
  }
};

/**
 * Sends a chat request to the backend proxy.
 * @param {object} payload - The chat payload.
 * @param {object} payload.config - The LLM configuration.
 * @param {Array<object>} payload.messages - The array of message objects.
 * @returns {Promise<object>} The AI's response.
 */
export const sendChatMessage = async (payload) => {
  const { config, messages } = payload;
  const requestBody = {
    ...config, // includes baseUrl, apiKey, model
    messages,
  };

  const response = await apiClient.post('/chat', requestBody);
  return response.data;
};
