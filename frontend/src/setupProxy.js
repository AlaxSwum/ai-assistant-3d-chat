const { createProxyMiddleware } = require('http-proxy-middleware');

// This proxy configuration only applies during development
module.exports = function(app) {
  // Only create proxy if API_URL is not set (development environment)
  if (!process.env.REACT_APP_API_URL) {
    app.use(
      '/api',
      createProxyMiddleware({
        target: 'http://localhost:8000',
        changeOrigin: true,
      })
    );
  }
}; 