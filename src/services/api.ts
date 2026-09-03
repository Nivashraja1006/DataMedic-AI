// API service for frontend-backend communication
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = configuredApiUrl.replace(/\/+$/, '').endsWith('/api')
  ? configuredApiUrl.replace(/\/+$/, '')
  : `${configuredApiUrl.replace(/\/+$/, '')}/api`;

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
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch {
    throw new Error('Unable to reach the API. Start the Flask backend on http://localhost:5000 and try again.');
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'API call failed');
  }

  return result;
};

// Auth service
export const authService = {
  signup: (username: string, email: string, password: string) =>
    apiCall('/auth/signup', 'POST', { username, email, password }),

  login: (email: string, password: string) =>
    apiCall('/auth/login', 'POST', { email, password }),

  getProfile: (token: string) =>
    apiCall('/auth/me', 'GET', null, token),
};

// Dataset service
export const datasetService = {
  getDatasets: (token: string) =>
    apiCall('/datasets', 'GET', null, token),

  getDataset: (datasetId: number, token: string) =>
    apiCall(`/datasets/${datasetId}`, 'GET', null, token),

  uploadDataset: async (file: File, name: string, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}/datasets/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }
    return result;
  },

  profileDataset: (datasetId: number, token: string) =>
    apiCall(`/datasets/${datasetId}/profile`, 'POST', {}, token),

  analyzeDataset: (datasetId: number, token: string) =>
    apiCall(`/datasets/${datasetId}/analyze`, 'POST', {}, token),

  detectIssues: (datasetId: number, token: string) =>
    apiCall(`/datasets/${datasetId}/detect-issues`, 'POST', {}, token),

  scoreDataset: (datasetId: number, token: string) =>
    apiCall(`/datasets/${datasetId}/score`, 'POST', {}, token),

  getIssues: (datasetId: number, token: string, severity?: string) => {
    let endpoint = `/datasets/${datasetId}/issues`;
    if (severity) endpoint += `?severity=${severity}`;
    return apiCall(endpoint, 'GET', null, token);
  },
};

// Copilot service
export const copilotService = {
  ask: (question: string, datasetId?: number) =>
    apiCall('/copilot', 'POST', { question, dataset_id: datasetId }),
};
