// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://hopeconnect-6gmo.onrender.com/api', 
    withCredentials: true, 
});

// ─── CRITICAL FIX: AUTOMATICALLY ATTACH JWT BEARER TOKEN ───
// This guarantees that protected routes (/auth/me, /resources, etc.) pass authentication
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;