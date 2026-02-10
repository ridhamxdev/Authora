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

// Storage helper functions using localStorage
const saveToStorage = (key: string, value: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
        console.log(`💾 Saved to localStorage: ${key} (length: ${value.length})`);
    }
};

const getFromStorage = (key: string): string | null => {
    if (typeof window !== 'undefined') {
        const value = localStorage.getItem(key);
        console.log(`📖 Read from localStorage: ${key} = ${value ? value.substring(0, 30) + '...' : 'null'}`);
        return value;
    }
    return null;
};

const removeFromStorage = (key: string) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed from localStorage: ${key}`);
    }
};

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,

    setAuth: (token, user) => {
        console.log('🔐 setAuth called with:', { token: token?.substring(0, 20) + '...', user });

        // Save to localStorage
        saveToStorage('auth_token', token);
        saveToStorage('auth_user', JSON.stringify(user));

        // Update Zustand state
        set({ token, user });
        console.log('✅ Auth state set and saved to localStorage');
    },

    logout: () => {
        console.log('🚪 Logging out...');
        removeFromStorage('auth_token');
        removeFromStorage('auth_user');
        set({ token: null, user: null });
        console.log('✅ Logged out successfully');
    },

    initializeAuth: () => {
        if (typeof window !== 'undefined') {
            try {
                console.log('🔄 Initializing auth from localStorage...');

                const token = getFromStorage('auth_token');
                const userStr = getFromStorage('auth_user');

                console.log('📦 Retrieved from localStorage:', {
                    hasToken: !!token,
                    tokenPreview: token?.substring(0, 20) + '...',
                    hasUser: !!userStr
                });

                // Only parse and set if we have valid data
                if (token && userStr && userStr !== 'undefined' && userStr !== 'null') {
                    const user = JSON.parse(userStr);
                    set({ token, user });
                    console.log('✅ Auth initialized successfully:', user);
                } else {
                    console.log('⚠️ No valid auth data in localStorage');
                }
            } catch (error) {
                console.error('❌ Failed to initialize auth:', error);
                removeFromStorage('auth_token');
                removeFromStorage('auth_user');
                set({ token: null, user: null });
            }
        }
    },
}));
