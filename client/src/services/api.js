// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
    // Included /api at the end to match server route mounting
    baseURL: 'https://hopeconnect-6gmo.onrender.com/api', 
    withCredentials: true, 
});

export default api;