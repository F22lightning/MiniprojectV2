import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchOrders = async () => {
    const res = await axios.get(`${API_URL}/orders`);
    return res.data;
};

export const fetchOrderHistory = async () => {
    const res = await axios.get(`${API_URL}/orders/history`);
    return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
    await axios.put(`${API_URL}/orders/${orderId}/status`, { status });
};

export const fetchCookingGuide = async (menuId) => {
    const res = await axios.get(`${API_URL}/menus/${menuId}/guide`);
    return res.data;
};

// --- NEW V2 API CALLS ---
export const fetchMenus = async () => {
    const res = await axios.get(`${API_URL}/menus`);
    return res.data;
};

export const createOrder = async (orderData) => {
    const res = await axios.post(`${API_URL}/orders`, orderData);
    return res.data;
};

export const fetchStats = async () => {
    const res = await axios.get(`${API_URL}/analytics/stats`);
    return res.data;
};

// --- ADMIN API CALLS ---
export const fetchCategories = async () => {
    const res = await axios.get(`${API_URL}/categories`);
    return res.data;
};

export const createMenu = async (menuData) => {
    const res = await axios.post(`${API_URL}/admin/menus`, menuData);
    return res.data;
};

export const deleteMenu = async (menuId) => {
    const res = await axios.delete(`${API_URL}/admin/menus/${menuId}`);
    return res.data;
};

export const saveSOP = async (menuId, sopData) => {
    const res = await axios.put(`${API_URL}/admin/guides/${menuId}`, sopData);
    return res.data;
};
