// API configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in development
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  
  // In production, use the environment variable or fallback
  return import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.railway.app';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to create API URLs
export const createApiUrl = (endpoint: string) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
