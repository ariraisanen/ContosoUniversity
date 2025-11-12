// T017: Base API client with Axios
import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for CORS
});

// Request interceptor for adding common headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add any additional headers here (e.g., auth tokens)
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 400:
          // Bad Request - validation errors
          console.error('Validation error:', error.response.data);
          break;
        case 401:
          // Unauthorized - redirect to login
          console.error('Unauthorized access');
          break;
        case 404:
          // Not Found
          console.error('Resource not found');
          break;
        case 409:
          // Conflict - likely concurrency issue
          console.error('Conflict error (concurrency):', error.response.data);
          break;
        case 500:
          // Internal Server Error
          console.error('Server error:', error.response.data);
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error: No response received');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
