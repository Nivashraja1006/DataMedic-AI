// API service for frontend-backend communication
import { API_BASE, loginUser, registerUser } from '@/lib/api';

const apiOrigin = API_BASE.replace(/\/+$/, '');

const getErrorMessage = async (response: Response) => {
  const text = await response.text();
  if (!text) return `API request failed (${response.status})`;

  try {
    const result = JSON.parse(text);
    return result.error || result.message || `API request failed (${response.status})`;
  } catch {
    return text;
  }
};

export const apiCall = async (endpoint: string, method: string = 'GET', data: unknown = null, token: string | null = null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  let response: Response;
  try {
    response = await fetch(`${apiOrigin}${endpoint}`, config);
  Render:
  FRONTEND_URL=https://your-vercel-app.vercel.app  } catch (error) {
    console.error(error);
    throw new Error(`Unable to reach the API at ${apiOrigin}. Start the Flask backend and try again.`);
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// Auth service
export const authService = {
  signup: (username: string, email: string, password: string) =>
    registerUser({ username, email, password }),

  login: (email: string, password: string) =>
    loginUser({ email, password }),

  getProfile: (token: string) =>
    apiCall('/api/auth/me', 'GET', null, token),
};

// Dataset service
export const datasetService = {
  getDatasets: (token: string) =>
    apiCall('/api/datasets', 'GET', null, token),

  getDataset: (datasetId: number, token: string) =>
    apiCall(`/api/datasets/${datasetId}`, 'GET', null, token),

  uploadDataset: async (file: File, name: string, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    let response: Response;
    try {
      response = await fetch(`${apiOrigin}/api/datasets/upload`, {
      method: 'POST',
      headers,
      body: formData,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Unable to reach the API at ${apiOrigin}. Start the Flask backend and try again.`);
    }

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    return response.json();
  },

  profileDataset: (datasetId: number, token: string) =>
    apiCall(`/api/datasets/${datasetId}/profile`, 'POST', {}, token),

  analyzeDataset: (datasetId: number, token: string) =>
    apiCall(`/api/datasets/${datasetId}/analyze`, 'POST', {}, token),

  detectIssues: (datasetId: number, token: string) =>
    apiCall(`/api/datasets/${datasetId}/detect-issues`, 'POST', {}, token),

  scoreDataset: (datasetId: number, token: string) =>
    apiCall(`/api/datasets/${datasetId}/score`, 'POST', {}, token),

  getIssues: (datasetId: number, token: string, severity?: string) => {
    let endpoint = `/api/datasets/${datasetId}/issues`;
    if (severity) endpoint += `?severity=${severity}`;
    return apiCall(endpoint, 'GET', null, token);
  },
};

// Copilot service
export const copilotService = {
  ask: (question: string, datasetId?: number) =>
    apiCall('/api/copilot', 'POST', { question, dataset_id: datasetId }),
};
