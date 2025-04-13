import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    login: string;
    sex: string;
}

export const getUserInfoFromToken = (): { login: string | null, sex: string | null } => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            return {
                login: decoded?.login || null,
                sex: decoded?.sex || null,
            };
        } catch (error) {
            console.error('Błąd dekodowania tokena', error);
        }
    }
    return { login: null, sex: null };
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