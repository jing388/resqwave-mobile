const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Replace with your Figma token and file key
const FIGMA_TOKEN = 'figd_pH5sY-QRXfRDlRzwKXHNz7pdFEwEpY57Q0JSWcfo';
const FILE_KEY = 'apaNtSAJMUijPPpCKPhLae';
const OUTPUT_FILE = path.join(__dirname, '../src/theme/designTokens.json');

async function fetchFigmaFile() {
  try {
    const response = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process the Figma file to extract design tokens
    const tokens = extractTokens(data);
    
    // Save to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tokens, null, 2));
    console.log('Design tokens synced successfully!');
    
  } catch (error) {
    console.error('Error syncing with Figma:', error);
    process.exit(1);
  }
}

function extractTokens(figmaData) {
  // This is a simplified example - you'll need to adjust based on your Figma structure
  const tokens = {
    colors: {},
    typography: {},
    spacing: {},
    // Add other token types as needed
  };

  // Process the Figma data to extract your design tokens
  // This is where you'll add logic to parse your specific Figma structure
  
  return tokens;
}

fetchFigmaFile();
