// client/src/services/messageService.js
import api from './api';

export const getConversations = async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
};

export const getMessages = async (params = {}) => {
    const response = await api.get('/messages', { params });
    return response.data;
};

export const sendMessage = async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
};
