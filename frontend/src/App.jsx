import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import LLMConfig from './components/LLMConfig';
import InputArea from './components/InputArea';

import ChatInterface from './components/ChatInterface';
import ResultPreview from './components/ResultPreview';
import { testLlmConfig, sendChatMessage } from './services/api';

// --- End of Placeholder Components ---


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  // Shared state for the application
  const [llmConfig, setLlmConfig] = useState({ baseUrl: '', apiKey: '', model: '' });
  const [content, setContent] = useState('');
  const [convertedMarkdown, setConvertedMarkdown] = useState('');
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // API call handlers
  const handleConvert = async () => {
    if (!content) {
      alert("Please provide some content to convert.");
      return;
    }
    setIsConverting(true);
    const prompt = `Please act as an expert technical writer. Analyze the following text and convert it into a well-structured Markdown document. Your goal is to preserve all key information and the original logical flow, but enhance it with clear formatting. Use headings, subheadings, lists (bulleted or numbered), and emphasis (bold or italics) where appropriate to improve readability. Do not add any new information or commentary. The output should be only the Markdown content.\n\n---\n\n${content}`;

    try {
      const response = await sendChatMessage({
        config: llmConfig,
        messages: [{ role: 'user', content: prompt }]
      });
      const markdown = response.choices[0]?.message?.content || "Error: Could not extract markdown from AI response.";
      setConvertedMarkdown(markdown);
    } catch (error) {
      console.error("Conversion failed:", error);
      alert(`Conversion failed: ${error.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  const handleConfigTest = async (config) => {
    return await testLlmConfig(config);
  };

  const handleSendMessage = async (message) => {
    const newMessages = [...messages, { sender: 'user', text: message }];
    setMessages(newMessages);
    setIsAiTyping(true);

    try {
      const aiResponse = await sendChatMessage({ config: llmConfig, messages: newMessages });
      // Assuming the AI response format is { choices: [{ message: { content: "..." } }] }
      const aiMessage = aiResponse.choices[0]?.message?.content || "Sorry, I couldn't get a response.";
      setMessages(prev => [...prev, { sender: 'ai', text: aiMessage }]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: `Error: ${error.message}` }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="xl" style={{ padding: '24px' }}>
        <Typography variant="h4" gutterBottom align="center">
          Content Conversion & AI Interaction Hub
        </Typography>

        <Grid container spacing={3}>
          {/* Left Column: Config and Input */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <LLMConfig onConfigSave={setLlmConfig} onConfigTest={handleConfigTest} />
              </Grid>
              <Grid item>
                <InputArea
                  onContentChange={setContent}
                  onConvert={handleConvert}
                  isConverting={isConverting}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column: Chat and Results */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onClearChat={handleClearChat}
                  isAiTyping={isAiTyping}
                />
              </Grid>
              <Grid item>
                 <ResultPreview markdownContent={convertedMarkdown || content} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
