const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
const API_URL = (configuredApiUrl || "https://datamedic-ai.onrender.com").replace(/\/+$/, "");

export const API_BASE_URL = API_URL;
export const API_BASE = API_URL;

type AuthData = Record<string, string>;
type ApiOptions = RequestInit & { token?: string | null };

export type AuthResponse = {
  access_token: string;
  user: {
    username: string;
    email: string;
    role: string;
    created_at?: string;
  };
};

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function getApiError(response: Response) {
  const body = await readResponseBody(response);
  if (typeof body === "object" && body !== null) {
    const payload = body as { error?: unknown; message?: unknown };
    if (typeof payload.error === "string") return payload.error;
    if (typeof payload.message === "string") return payload.message;
  }

  if (typeof body === "string") return body;
  return `API request failed (${response.status})`;
}

export async function requestJson<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.token) headers.set("Authorization", `Bearer ${options.token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(buildApiUrl(path), { ...options, headers });
  } catch {
    throw new Error(`Unable to reach the API at ${API_URL}.`);
  }

  if (!response.ok) throw new Error(await getApiError(response));

  const body = await readResponseBody(response);
  return body as T;
}

export async function registerUser(data: AuthData): Promise<AuthResponse> {
  return requestJson<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: AuthData): Promise<AuthResponse> {
  return requestJson<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
