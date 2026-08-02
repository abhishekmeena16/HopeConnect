// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
    // Changed from 5000 to 5001 to match your new backend port!
    baseURL: 'https://hopeconnect-6gmo.onrender.com', 
    withCredentials: true, 
});

export default api;