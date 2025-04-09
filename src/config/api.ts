// API configuration
import axios from 'axios';

// Get the current hostname to determine the base URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser environment - use the current hostname
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    return `${protocol}//${hostname}${port}`;
  }
  // Server-side rendering - use the Vercel URL or a fallback
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8080';
};

// Create the API client with the correct base URL
const apiClient = axios.create({
  baseURL: getBaseUrl(),
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔍 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data, 'URL:', error.config?.url);
    return Promise.reject(error);
  }
);

export default apiClient;
