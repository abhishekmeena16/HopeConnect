// client/src/services/api.js
import axios from 'axios';

// Dynamically determine the backend API base URL
const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Check if running on localhost in browser
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return 'http://localhost:5001/api';
    }
    // Fallback to deployed backend
    return 'https://hopeconnect-6gmo.onrender.com/api';
};

export const API_BASE_URL = getBaseURL();
export const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 15000,
});

// Automatically attach Bearer token to all outgoing requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to gracefully handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
            if (!isAuthRoute && localStorage.getItem('token')) {
                // Token might be expired or invalid
                console.warn('Session expired or unauthorized request intercepted.');
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Robust utility to resolve image URLs whether they are:
 * - Absolute Cloudinary/Unsplash URLs (https://...)
 * - Relative local backend uploads (/uploads/...)
 * - Fallback null
 */
export const resolveImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
        return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${BACKEND_ORIGIN}${cleanPath}`;
};

export default api;