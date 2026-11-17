// client/src/services/aidRequestService.js
import api from './api';

export const getAllAidRequests = async (params = {}) => {
    const response = await api.get('/aid-requests', { params });
    return response.data;
};

export const createAidRequest = async (requestData) => {
    const response = await api.post('/aid-requests', requestData);
    return response.data;
};

export const fulfillAidRequest = async (requestId) => {
    const response = await api.post(`/aid-requests/${requestId}/fulfill`);
    return response.data;
};

export const deleteAidRequest = async (requestId) => {
    const response = await api.delete(`/aid-requests/${requestId}`);
    return response.data;
};
