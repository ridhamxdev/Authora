import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable cookies
});

// Interceptor removed as cookies are handled automatically by browser
// api.interceptors.request.use((config) => { ... });

export default api;
