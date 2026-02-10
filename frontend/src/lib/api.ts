import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable cookies for HTTP-only cookie from backend
});

// Add request interceptor to include auth token from localStorage
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            console.log('🔑 API Interceptor - Token from localStorage:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');

            if (token && token !== 'undefined' && token !== 'null') {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('✅ Authorization header added to request:', config.url);
            } else {
                console.log('⚠️ No valid token, request will be unauthenticated:', config.url);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
