require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Figma API base URL
const FIGMA_API = 'https://api.figma.com/v1';

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  req.figmaToken = token;
  next();
};

// Get file data
app.get('/api/figma/file', authenticate, async (req, res) => {
  try {
    const response = await fetch(
      `${FIGMA_API}/files/${process.env.FIGMA_FILE_KEY}`,
      {
        headers: {
          'X-Figma-Token': req.figmaToken,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Figma API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Figma file:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get file nodes
app.get('/api/figma/nodes', authenticate, async (req, res) => {
  const { ids } = req.query;
  if (!ids) {
    return res.status(400).json({ error: 'Node IDs are required' });
  }

  try {
    const response = await fetch(
      `${FIGMA_API}/files/${process.env.FIGMA_FILE_KEY}/nodes?ids=${encodeURIComponent(ids)}`,
      {
        headers: {
          'X-Figma-Token': req.figmaToken,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Figma API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Figma nodes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get file styles
app.get('/api/figma/styles', authenticate, async (req, res) => {
  try {
    const response = await fetch(
      `${FIGMA_API}/files/${process.env.FIGMA_FILE_KEY}/styles`,
      {
        headers: {
          'X-Figma-Token': req.figmaToken,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Figma API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Figma styles:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`MCP Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`- GET /api/figma/file`);
  console.log(`- GET /api/figma/nodes?ids=node1,node2`);
  console.log(`- GET /api/figma/styles`);
});
