// Configuration for API endpoints
// In production (when deployed), use relative URL to same domain
// In development, use localhost:8000
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000');

// Export configuration
const config = {
  API_URL
};

export default config;