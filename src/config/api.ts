// API configuration
import axios from 'axios';

// API base URL - will use Railway in production and local in development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Configure axios with base URL for all API requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;
