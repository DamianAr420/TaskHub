import { jwtDecode } from 'jwt-decode';
import { apiRequest } from '../helpers/api';

interface DecodedToken {
  login: string;
  id: string;
  exp: number;
}

export const getUserInfoFromToken = (): { login: string | null; id: string | null; exp: number | null } => {
  const token = getToken();
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        login: decoded?.login || null,
        id: decoded?.id || null,
        exp: decoded?.exp || null,
      };
    } catch (error) {
      console.error('Błąd dekodowania tokena', error);
    }
  }
  return { login: null, id: null, exp: null };
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const refreshToken = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await apiRequest('/refreshToken', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Błąd odświeżania tokena');

    const data = response.data;
    if (data.token) {
      setToken(data.token);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Błąd przy odświeżaniu tokena:", error);
    return false;
  }
};

