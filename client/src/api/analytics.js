import axios from 'axios';

const API_URL = 'http://localhost:6969/api';

export const getDashboardAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/dashboard`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 