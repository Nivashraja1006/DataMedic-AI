const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
export const API_BASE_URL = API_BASE;

export { API_BASE };

console.log("API URL:", API_BASE);

if (!API_BASE) {
	throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

type AuthData = Record<string, string>;

const getApiError = async (response: Response) => {
	const text = await response.text();
	if (!text) return `API request failed (${response.status})`;

	try {
		const result = JSON.parse(text);
		return result.error || result.message || `API request failed (${response.status})`;
	} catch {
		return text;
	}
};

const parseAuthResponse = async (response: Response) => {
	if (!response.ok) {
		throw new Error(await getApiError(response));
	}

	return response.json();
};

export async function registerUser(data: AuthData) {
	try {
		const response = await fetch(`${API_BASE}/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		return parseAuthResponse(response);
	} catch (error) {
		console.error(error);
		if (error instanceof Error) throw error;
		throw new Error(`Unable to reach the API at ${API_BASE}. Start the Flask backend and try again.`);
	}
}

export async function loginUser(data: AuthData) {
	try {
		const response = await fetch(`${API_BASE}/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		return parseAuthResponse(response);
	} catch (error) {
		console.error(error);
		if (error instanceof Error) throw error;
		throw new Error(`Unable to reach the API at ${API_BASE}. Start the Flask backend and try again.`);
	}
}
