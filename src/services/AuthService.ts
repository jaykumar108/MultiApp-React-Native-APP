import StorageService from '../utils/storage';
import { getApiUrl } from '../config/deviceConfig';

// Multiple API URLs to try in order
const API_URLS = [
  'https://multi-app-backend.vercel.app/api/auth',  // Production server
];

let currentApiUrl = API_URLS[0];

interface RegisterData {
  name: string;
  city: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface OTPData {
  email: string;
  otp: string;
}

interface SendOTPData {
  email: string;
}

interface ApiResponse {
  success?: boolean;
  message: string;
  user?: any;
  data?: any;
  token?: string | null;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
    data?: any,
    requiresAuth: boolean = false,
    retryCount: number = 0
  ): Promise<ApiResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (requiresAuth) {
        const token = await this.getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const config: RequestInit = {
        method,
        headers,
        // credentials: 'include', // Temporarily disabled for testing
      };

      if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
      }

      console.log('Making API request to:', `${currentApiUrl}${endpoint}`);
      console.log('Request data:', data);
      console.log('Request headers:', headers);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${currentApiUrl}${endpoint}`, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      const responseData = await response.json();

      console.log('API Response status:', response.status);
      console.log('API Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Network error occurred');
      }

      // For your API, we need to handle the fact that JWT is in HTTP-only cookies
      // We'll create a session-based token for the app
      let sessionToken: string | null = await this.getToken();
      if (!sessionToken && responseData.user) {
        // Create a session token based on user data
        sessionToken = `session_${responseData.user.id}_${Date.now()}`;
        await this.setToken(sessionToken);
      }

      // Transform the response to match our expected format
      return {
        success: true,
        message: responseData.message,
        data: responseData.user || responseData.data,
        token: sessionToken,
        user: responseData.user
      };
    } catch (error: any) {
      console.error(`API Error (attempt ${retryCount + 1}):`, error);
      
      // Try different URL if network error and we haven't tried all URLs
      if (retryCount < API_URLS.length - 1 && (error.message?.includes('Network request failed') || error.name === 'AbortError')) {
        console.log(`Retrying with different URL (attempt ${retryCount + 1}/${API_URLS.length})`);
        
        // Switch to next URL
        currentApiUrl = API_URLS[retryCount + 1];
        console.log('Switching to URL:', currentApiUrl);
        
        // Retry with new URL
        return this.makeRequest(endpoint, method, data, requiresAuth, retryCount + 1);
      }
      
      // If all URLs failed, throw the error
      console.log('All API URLs failed');
      throw error;
    }
  }



  // Register new user
  async register(userData: RegisterData): Promise<ApiResponse> {
    const response = await this.makeRequest('/register', 'POST', userData);
    // For registration, we don't need to transform the response as much
    return {
      success: true,
      message: response.message,
      data: response.user || response.data
    };
  }

  // Send OTP to email
  async sendOTP(emailData: SendOTPData): Promise<ApiResponse> {
    return this.makeRequest('/send-otp', 'POST', emailData);
  }

  // Verify OTP
  async verifyOTP(otpData: OTPData): Promise<ApiResponse> {
    return this.makeRequest('/verify-otp', 'POST', otpData);
  }

  // Login with password
  async loginWithPassword(loginData: LoginData): Promise<ApiResponse> {
    return this.makeRequest('/login', 'POST', loginData);
  }

  // Logout
  async logout(): Promise<ApiResponse> {
    const response = await this.makeRequest('/logout', 'POST', {}, true);
    if (response.success) {
      await this.clearToken();
    }
    return response;
  }

  // Get user profile
  async getProfile(): Promise<ApiResponse> {
    return this.makeRequest('/profile', 'GET', undefined, true);
  }

  // Token management
  async setToken(token: string): Promise<void> {
    this.token = token;
    await StorageService.setItem('authToken', token);
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await StorageService.getItem('authToken'); 
    }
    return this.token;
  }

  async clearToken(): Promise<void> {
    this.token = null;
    await StorageService.removeItem('authToken');
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export default AuthService.getInstance(); 