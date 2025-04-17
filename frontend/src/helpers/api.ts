const BASE_URL = process.env.REACT_APP_API_URL;

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

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
  if (token) defaultHeaders.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Błąd serwera');
    return { ok: true, status: res.status, data };
  } catch (err: any) {
    console.error('❌ apiRequest error:', err);
    return { ok: false, status: err.status || 500, data: { error: err.message } };
  }
};
