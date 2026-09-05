import { loginUser, registerUser, requestJson } from "@/lib/api";

export function getHealth() {
  return requestJson<{ status: string }>("/health");
}

export function uploadFile(file: File, token?: string | null, name?: string) {
  const formData = new FormData();
  formData.append("file", file);
  if (name) formData.append("name", name);

  return requestJson<{ dataset: any }>("/upload", {
    method: "POST",
    body: formData,
    token,
  });
}

export const apiCall = <T = any>(
  endpoint: string,
  method = "GET",
  data: unknown = null,
  token: string | null = null,
) =>
  requestJson<T>(endpoint, {
    method,
    body: data && method !== "GET" ? JSON.stringify(data) : undefined,
    token,
  });

export const authService = {
  signup: (username: string, email: string, password: string) =>
    registerUser({ username, email, password }),
  login: (email: string, password: string) => loginUser({ email, password }),
  getProfile: (token: string) => apiCall("/api/auth/me", "GET", null, token),
};

export const datasetService = {
  getDatasets: (token: string) => apiCall("/api/datasets", "GET", null, token),
  getDataset: (datasetId: number, token: string) =>
    apiCall(`/api/datasets/${datasetId}`, "GET", null, token),
  uploadDataset: (file: File, name: string, token: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    return requestJson<{ dataset: any }>("/api/datasets/upload", {
      method: "POST",
      body: formData,
      token,
    });
  },
  profileDataset: (datasetId: number, token: string) =>
    apiCall(`/api/datasets/${datasetId}/profile`, "POST", {}, token),
  analyzeDataset: (datasetId: number, token: string) =>
    apiCall(`/api/datasets/${datasetId}/analyze`, "POST", {}, token),
  detectIssues: (datasetId: number, token: string) =>
    apiCall(`/api/datasets/${datasetId}/detect-issues`, "POST", {}, token),
  scoreDataset: (datasetId: number, token: string) =>
    apiCall(`/api/datasets/${datasetId}/score`, "POST", {}, token),
  getIssues: (datasetId: number, token: string, severity?: string) =>
    apiCall(
      `/api/datasets/${datasetId}/issues${severity ? `?severity=${severity}` : ""}`,
      "GET",
      null,
      token,
    ),
};

export const copilotService = {
  ask: (question: string, datasetId?: number) =>
    apiCall("/api/copilot", "POST", { question, dataset_id: datasetId }),
};
