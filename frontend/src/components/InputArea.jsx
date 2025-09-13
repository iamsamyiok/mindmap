import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Paper, Typography, TextField, Box, Button } from '@mui/material';
import mammoth from 'mammoth';

const InputArea = ({ onContentChange, onConvert, isConverting }) => {
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (file.name.endsWith('.docx')) {
          const arrayBuffer = event.target.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          onContentChange(result.value);
        } else { // .txt and other text files
          onContentChange(event.target.result);
        }
      } catch (error) {
        console.error("Error reading file:", error);
        alert("Failed to read the file. It might be corrupted or in an unsupported format.");
      }
    };

    if (file.name.endsWith('.docx')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }, [onContentChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const handleTextChange = (event) => {
    onContentChange(event.target.value);
  };

  return (
    <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
      <Typography variant="h6" gutterBottom>Content Input</Typography>
      <TextField
        multiline
        rows={8}
        fullWidth
        variant="outlined"
        placeholder="Type or paste your content here..."
        onChange={handleTextChange}
        style={{ marginBottom: '16px' }}
      />
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${isDragActive ? '#2196f3' : 'grey'}`,
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '4px',
          backgroundColor: isDragActive ? '#e3f2fd' : 'transparent',
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          {isDragActive ?
            "Drop the files here ..." :
            "Drag 'n' drop files here, or click to select (.txt, .docx)"
          }
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={onConvert}
        disabled={isConverting}
        sx={{ mt: 2 }}
      >
        {isConverting ? 'Converting...' : 'Refine to Markdown & Mind Map'}
      </Button>
    </Paper>
  );
};

export default InputArea;
