const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
    method?: RequestMethod;
    body?: any;
    token?: string;
    headers?: Record<string, string>;
}

export const apiRequest = async (endpoint: string, options: RequestOptions = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const { method = 'GET', body, token, headers = {} } = options;

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();
        return {
            ok: response.ok,
            status: response.status,
            data,
        };
    } catch (error) {
        console.error("❌ Błąd żądania:", error);
        return {
            ok: false,
            status: 500,
            data: { error: "Błąd połączenia z serwerem" },
        };
    }
};
