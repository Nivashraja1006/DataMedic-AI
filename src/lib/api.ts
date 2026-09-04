const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_BASE = API_URL;
export const API_BASE_URL = API_URL;

export { API_BASE };

console.log("API URL:", API_URL);

if (!API_URL) {
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
		const response = await fetch(`${API_URL}/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		return parseAuthResponse(response);
	} catch (error) {
		console.error(error);
		if (error instanceof Error) throw error;
		throw new Error(`Unable to reach the API at ${API_URL}. Start the Flask backend and try again.`);
	}
}

export async function loginUser(data: AuthData) {
	try {
		const response = await fetch(`${API_URL}/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		return parseAuthResponse(response);
	} catch (error) {
		console.error(error);
		if (error instanceof Error) throw error;
		throw new Error(`Unable to reach the API at ${API_URL}. Start the Flask backend and try again.`);
	}
}
