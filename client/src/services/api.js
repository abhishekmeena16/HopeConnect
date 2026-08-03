// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://hopeconnect-6gmo.onrender.com/api', 
    withCredentials: true, 
});

// Automatically attach JWT token to all outgoing requests
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

export default api;