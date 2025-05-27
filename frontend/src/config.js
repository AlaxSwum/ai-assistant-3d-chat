// API configuration based on environment
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Export configuration
const config = {
  API_URL
};

export default config; 