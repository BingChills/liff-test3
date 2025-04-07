// API configuration
import axios from 'axios';

// For Vercel deployment, we use relative API paths 
// This works because both frontend and backend are deployed together
const apiClient = axios.create({
  // No baseURL needed - relative paths will work with Vercel's rewrites
});

export default apiClient;
