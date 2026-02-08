import { create } from 'zustand';

interface AuthState {
    token: string | null;
    user: {
        id: string;
        name: string;
        email: string;
        isAdmin: boolean;
    } | null;
    setAuth: (token: string, user: any) => void;
    logout: () => void;
    initializeAuth: () => void;
}

// Cookie helper functions
const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,

    setAuth: (token, user) => {
        setCookie('auth_token', token, 7);
        setCookie('auth_user', JSON.stringify(user), 7);
        set({ token, user });
    },

    logout: () => {
        deleteCookie('auth_token');
        deleteCookie('auth_user');
        set({ token: null, user: null });
    },

    initializeAuth: () => {
        if (typeof window !== 'undefined') {
            try {
                const token = getCookie('auth_token');
                const userStr = getCookie('auth_user');

                // Only parse and set if we have valid data
                if (token && userStr) {
                    const user = JSON.parse(userStr);
                    set({ token, user });
                }
            } catch (error) {
                // If parsing fails, clear cookies and reset state
                console.error('Failed to initialize auth:', error);
                deleteCookie('auth_token');
                deleteCookie('auth_user');
                set({ token: null, user: null });
            }
        }
    },
}));
