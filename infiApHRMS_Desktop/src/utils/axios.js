import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Send cookies with requests
});

// Add a request interceptor to handle FormData
api.interceptors.request.use(
    (config) => {
        const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;

        if (isFormData) {
            delete config.headers['Content-Type'];
            delete config.headers['content-type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for automatic logout on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — redirect to login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
