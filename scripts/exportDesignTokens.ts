import { writeFileSync } from 'fs';
import { figmaClient } from '../utils/figmaService';

async function exportDesignTokens() {
  try {
    // Get the document
    const { document } = await figmaClient.getFile('apaNtSAJMUijPPpCKPhLae');
    
    // Extract styles (colors, typography, etc.)
    const styles = {
      colors: {},
      typography: {},
      // Add other style types as needed
    };

    // Process the document to extract styles
    // This is a simplified example - you'll need to adjust based on your Figma structure
    function processNode(node: any) {
      // Example: Extract color styles
      if (node.type === 'RECTANGLE' && node.fills) {
        // Process fills to extract colors
      }
      
      // Example: Extract text styles
      if (node.type === 'TEXT') {
        // Process text styles
      }

      // Recursively process children
      if (node.children) {
        node.children.forEach(processNode);
      }
    }

    processNode(document);

    // Save to a file
    writeFileSync(
      './src/theme/designTokens.json',
      JSON.stringify(styles, null, 2)
    );

    console.log('Design tokens exported successfully!');
  } catch (error) {
    console.error('Error exporting design tokens:', error);
    process.exit(1);
  }
}

exportDesignTokens();
