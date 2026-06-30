// client/src/services/resourceService.js
import api from './api'; // The Axios instance we created in Phase 7

// Fetch high-priority emergency resources
export const getEmergencyResources = async () => {
    const response = await api.get('/resources/emergency');
    return response.data;
};

// Create a new donation/request
export const createResource = async (resourceData) => {
    const response = await api.post('/resources', resourceData);
    return response.data;
};

// Claim a resource (Update status)
export const updateResourceStatus = async (resourceId, status) => {
    const response = await api.put(`/resources/${resourceId}/status`, { status });
    return response.data;
};