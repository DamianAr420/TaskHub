import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  login: string;
  id: string;
}

export const getUserInfoFromToken = (): { login: string | null; id: string | null } => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        login: decoded?.login || null,
        id: decoded?.id || null,
      };
    } catch (error) {
      console.error('Błąd dekodowania tokena', error);
    }
  } else console.error("brak tokenu")
  return { login: null, id: null };
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
