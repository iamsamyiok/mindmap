import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box, CircularProgress, Snackbar, Alert } from '@mui/material';

const LLMConfig = ({ onConfigSave, onConfigTest }) => {
  const [config, setConfig] = useState({
    baseUrl: '',
    apiKey: '',
    model: '',
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: bool, message: string }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onConfigSave(config);
    // Optionally show feedback
    alert('Configuration saved!');
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await onConfigTest(config);
    setTestResult(result);
    setTesting(false);
  };

  const handleCloseSnackbar = () => {
    setTestResult(null);
  };

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Typography variant="h6" gutterBottom>LLM Configuration</Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Base URL"
          name="baseUrl"
          value={config.baseUrl}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="API Key"
          name="apiKey"
          type="password"
          value={config.apiKey}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Model Name"
          name="model"
          value={config.model}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Box sx={{ position: 'relative' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleTest}
              disabled={testing}
            >
              Test Config
            </Button>
            {testing && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
      {testResult && (
        <Snackbar
          open
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={testResult.success ? 'success' : 'error'} sx={{ width: '100%' }}>
            {testResult.message}
          </Alert>
        </Snackbar>
      )}
    </Paper>
  );
};

export default LLMConfig;
