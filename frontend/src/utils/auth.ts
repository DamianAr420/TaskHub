import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  login: string;
  _id: string;
}

export const getUserInfoFromToken = (): { login: string | null; _id: string | null } => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        login: decoded?.login || null,
        _id: decoded?._id || null,
      };
    } catch (error) {
      console.error('Błąd dekodowania tokena', error);
    }
  }
  return { login: null, _id: null };
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
