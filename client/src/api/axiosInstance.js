import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:6969/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url, 'with data:', config.data);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Received response from:', response.config.url, 'with data:', response.data);
        return response;
    },
    (error) => {
        console.error('Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export default axiosInstance;
