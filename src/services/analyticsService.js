import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

// Add token to axios requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboardAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/dashboard`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTrends = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/trends`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const analyticsService = {
  getDashboardAnalytics,
  getTrends
};

export default analyticsService;
