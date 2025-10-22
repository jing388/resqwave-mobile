import { FigmaClient } from 'figma-api';

const FIGMA_ACCESS_TOKEN = 'YOUR_FIGMA_ACCESS_TOKEN';
const FILE_KEY = 'apaNtSAJMUijPPpCKPhLae';

export const figmaClient = new FigmaClient({
  personalAccessToken: FIGMA_ACCESS_TOKEN,
});

export async function getFileNodes(nodeIds: string[]) {
  try {
    return await figmaClient.getFileNodes(FILE_KEY, nodeIds);
  } catch (error) {
    console.error('Error fetching Figma nodes:', error);
    throw error;
  }
}

export async function getFile() {
  try {
    return await figmaClient.getFile(FILE_KEY);
  } catch (error) {
    console.error('Error fetching Figma file:', error);
    throw error;
  }
}

export async function getStyles() {
  try {
    return await figmaClient.getFileStyles(FILE_KEY);
  } catch (error) {
    console.error('Error fetching Figma styles:', error);
    throw error;
  }
}
