const API_BASE_URL = 'http://localhost:3001/api/figma';

export interface FigmaFileResponse {
  document: any;
  components: Record<string, any>;
  styles: Record<string, any>;
}

export interface FigmaNodesResponse {
  nodes: Record<string, any>;
}

export interface FigmaStylesResponse {
  meta: {
    styles: {
      key: string;
      name: string;
      styleType: string;
    }[];
  };
}

const fetchWithAuth = async (url: string, token: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch from Figma API');
  }

  return response.json();
};

export const getFigmaFile = async (token: string): Promise<FigmaFileResponse> => {
  return fetchWithAuth(`${API_BASE_URL}/file`, token);
};

export const getFigmaNodes = async (token: string, nodeIds: string[]): Promise<FigmaNodesResponse> => {
  return fetchWithAuth(`${API_BASE_URL}/nodes?ids=${nodeIds.join(',')}`, token);
};

export const getFigmaStyles = async (token: string): Promise<FigmaStylesResponse> => {
  return fetchWithAuth(`${API_BASE_URL}/styles`, token);
};
