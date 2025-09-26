import axios from 'axios';

// Determine the correct API URL based on environment
const getApiUrl = () => {
  // In development, always use localhost
  if (import.meta.env.DEV || window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  
  // In production, use the environment variable or fallback
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

// Create axios instance with base configuration
const API = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // allow sending cookies if needed
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- API calls ---

// Auth API calls
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getCurrentUser: () => API.get('/auth/me'),
};

// Tools API calls
export const toolsAPI = {
  getAll: (params) => API.get('/tools', { params }),
  getById: (id) => API.get(`/tools/${id}`),
  create: (toolData) => API.post('/tools', toolData),
  update: (id, toolData) => API.put(`/tools/${id}`, toolData),
  delete: (id) => API.delete(`/tools/${id}`),
  assign: (id, assignmentData) => API.post(`/tools/${id}/assign`, assignmentData),
  return: (id, returnData) => API.post(`/tools/${id}/return`, returnData),
  getMyTools: () => API.get('/tools/my-tools'),
};

// Users API calls
export const usersAPI = {
  getAll: () => API.get('/users'),
  getById: (id) => API.get(`/users/${id}`),
  update: (id, userData) => API.put(`/users/${id}`, userData),
  delete: (id) => API.delete(`/users/${id}`),
};

export default API;
