// client/src/services/resourceService.js
import api from './api';

// Fetch all unclaimed resources with optional filters
export const getAllResources = async (params = {}) => {
    const response = await api.get('/resources', { params });
    return response.data;
};

// Fetch high-priority emergency resources
export const getEmergencyResources = async () => {
    const response = await api.get('/resources/emergency');
    return response.data;
};

// Create a new donation resource entry (supports FormData with image file)
export const createResource = async (resourceData) => {
    const response = await api.post('/resources', resourceData);
    return response.data;
};

// Establish a distribution matching route (claim resource)
export const claimResource = async (resourceId) => {
    const response = await api.post(`/resources/${resourceId}/claim`);
    return response.data;
};

// Update status (e.g. IN_TRANSIT, DELIVERED, CANCELLED)
export const updateResourceStatus = async (resourceId, status) => {
    const response = await api.put(`/resources/${resourceId}/status`, { status });
    return response.data;
};

// Fetch verified audit ledger history for current user
export const getActivityHistory = async () => {
    const response = await api.get('/resources/history');
    return response.data;
};

// Fetch platform-wide humanitarian impact metrics
export const getImpactAnalytics = async () => {
    const response = await api.get('/resources/analytics');
    return response.data;
};