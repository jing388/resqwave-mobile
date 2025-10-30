import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface LoginCredentials {
  emailOrNumber: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  tempToken: string;
}

export interface VerifyCodeRequest {
  tempToken: string;
  code: string;
}

export interface VerifyCodeResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'focalPerson' | 'admin' | 'dispatcher';
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Storage keys
const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

class AuthService {
  // Focal Person Login (sends OTP)
  async focalLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/focal-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Verify OTP code
  async verifyCode(request: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/focal-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      // Store token and user data
      await this.storeAuthData(data.token, data.user);

      return data;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await this.getToken();
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/auth/current-user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        await this.clearAuthData();
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const token = await this.getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearAuthData();
    }
  }

  // Store auth data
  private async storeAuthData(token: string, user: User): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Get token
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }

  // Get stored user
  async getStoredUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Clear auth data
  async clearAuthData(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  // Mock login for development (remove when backend is ready)
  async mockLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (!credentials.emailOrNumber || !credentials.password) {
      throw new Error('Email/phone and password are required');
    }

    if (credentials.password.length < 6) {
      throw new Error('Invalid credentials');
    }

    // Return mock response
    return {
      message: 'Verification code sent to email',
      tempToken: 'mock_temp_token_' + Date.now(),
    };
  }

  // Mock verify for development
  async mockVerifyCode(
    request: VerifyCodeRequest,
  ): Promise<VerifyCodeResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Accept any 6-digit code
    if (request.code.length !== 6) {
      throw new Error('Invalid verification code');
    }

    const mockUser = {
      id: 'FP001',
      name: 'Juan Dela Cruz',
      email: 'juan.delacruz@resqwave.ph',
      role: 'focalPerson' as const,
    };

    const mockToken = 'mock_token_' + Date.now();
    await this.storeAuthData(mockToken, mockUser);

    return {
      message: 'Login successful',
      token: mockToken,
      user: mockUser,
    };
  }
}

export const authService = new AuthService();
