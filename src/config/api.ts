// API Configuration
export const API_CONFIG = {
  // Development
  DEV: {
    BASE_URL: 'https://multi-app-backend.vercel.app/api',
    AUTH_URL: 'https://multi-app-backend.vercel.app/api/auth',
    TODOS_URL: 'https://multi-app-backend.vercel.app/api/todos',
  },
  
  // Production
  PROD: {
    BASE_URL: 'https://multi-app-backend.vercel.app/api',
    AUTH_URL: 'https://multi-app-backend.vercel.app/api/auth',
    TODOS_URL: 'https://multi-app-backend.vercel.app/api/todos',
  },
  
  // Staging
  STAGING: {
    BASE_URL: 'https://multi-app-backend.vercel.app/api',
    AUTH_URL: 'https://multi-app-backend.vercel.app/api/auth',
    TODOS_URL: 'https://multi-app-backend.vercel.app/api/todos',
  },
};

// Get current environment
const getEnvironment = () => {
  // You can set this based on your build configuration
  // For now, defaulting to DEV
  return process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';
};

export const getApiConfig = () => {
  const env = getEnvironment();
  return API_CONFIG[env as keyof typeof API_CONFIG];
};

// Timeout settings
export const API_TIMEOUT = 30000; // 30 seconds

// Retry settings
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000; // 1 second 