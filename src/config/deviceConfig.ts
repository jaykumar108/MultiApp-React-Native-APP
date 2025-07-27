import { Platform } from 'react-native';

// Get the appropriate base URL based on the platform and environment
export const getBaseUrl = () => {
  // Use the production server URL for all platforms
  return 'https://multi-app-backend.vercel.app';
};

// For physical device testing, replace with your computer's IP address
export const getPhysicalDeviceUrl = () => {
  // Use the production server URL
  return 'https://multi-app-backend.vercel.app';
};

// Check if running on physical device
export const isPhysicalDevice = () => {
  // You can implement device detection logic here
  // For now, we'll use a simple check
  return false; // Set to true when testing on physical device
};

// Get the final API URL
export const getApiUrl = () => {
  // Always use the production server URL
  return 'https://multi-app-backend.vercel.app';
}; 