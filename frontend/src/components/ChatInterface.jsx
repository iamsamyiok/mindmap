import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Box, TextField, Button, IconButton, CircularProgress } from '@mui/material';
import { ClearAll as ClearAllIcon, Send as SendIcon } from '@mui/icons-material';

const ChatInterface = ({ messages, onSendMessage, onClearChat, isAiTyping }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">AI Chat</Typography>
        <IconButton onClick={onClearChat} title="Clear Chat">
          <ClearAllIcon />
        </IconButton>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 1, border: '1px solid #444', borderRadius: 1 }}>
        {messages.length === 0 ? (
          <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 2 }}>
            Chat history will appear here.
          </Typography>
        ) : (
          messages.map((msg, index) => (
            <Box key={index} sx={{ mb: 1, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  display: 'inline-block',
                  maxWidth: '80%',
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                  color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>
              </Paper>
            </Box>
          ))
        )}
        {isAiTyping && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              AI is typing...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question about the content..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          sx={{ ml: 1 }}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatInterface;
