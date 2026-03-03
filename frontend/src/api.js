import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const fetchOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
};

export const fetchCookingGuide = async (menuId) => {
    const response = await api.get(`/menus/${menuId}/guide`);
    return response.data;
};

export default api;
