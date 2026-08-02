// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
    // Changed from 5000 to 5001 to match your new backend port!
    baseURL: 'http://localhost:5001/api', 
    withCredentials: true, 
});

export default api;