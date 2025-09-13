import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Box, Tabs, Tab, Button, Menu, MenuItem } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { saveAs } from 'file-saver'; // We need to install this library
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';

const transformer = new Transformer();

const ResultPreview = ({ markdownContent }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const svgRef = useRef(null);
  const mmRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadMD = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, 'conversion-result.md');
    handleClose();
  };

  const handleDownloadSVG = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(blob, 'mindmap.svg');
    }
    handleClose();
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    if (tabIndex === 1 && svgRef.current && markdownContent) {
      // If a markmap instance already exists, update it
      if (mmRef.current) {
        const { root } = transformer.transform(markdownContent);
        mmRef.current.setData(root);
      } else { // Otherwise, create a new one
        const { root } = transformer.transform(markdownContent);
        mmRef.current = Markmap.create(svgRef.current, null, root);
      }
    }
  }, [tabIndex, markdownContent]);

  return (
    <Paper elevation={3} sx={{ p: 2, height: '450px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Conversion Results</Typography>
        <Button
          id="download-button"
          aria-controls={open ? 'download-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          variant="outlined"
        >
          Download
        </Button>
        <Menu
          id="download-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'download-button',
          }}
        >
          <MenuItem onClick={handleDownloadMD}>as Markdown (.md)</MenuItem>
          <MenuItem onClick={handleDownloadSVG} disabled={!markdownContent}>as Mind Map (.svg)</MenuItem>
        </Menu>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 1 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="result preview tabs">
          <Tab label="Markdown" />
          <Tab label="Mind Map" />
        </Tabs>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {tabIndex === 0 && (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContent || "# Your refined Markdown will appear here."}
          </ReactMarkdown>
        )}
        {tabIndex === 1 && (
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
        )}
      </Box>
    </Paper>
  );
};

export default ResultPreview;
