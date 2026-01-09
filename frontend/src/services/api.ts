const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  errors?: Array<{ msg: string; param: string }>;
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Request failed', errors: data.errors };
    }

    return { data };
  } catch (error) {
    console.error('API request error:', error);
    return { error: 'Network error. Please check your connection.' };
  }
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

// Set auth token in localStorage
function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

// Clear auth token from localStorage
function clearAuthToken(): void {
  localStorage.removeItem('authToken');
}

// Authentication API
export const authAPI = {
  async register(
    phone: string,
    password: string,
    role: 'labour' | 'employer',
    language: 'hi' | 'en' = 'hi'
  ) {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ phone, password, role, language }),
    });

    if (response.data) {
      const { user, token } = response.data as any;
      setAuthToken(token);
      return { user, token };
    }

    throw new Error(response.error || 'Registration failed');
  },

  async login(phone: string, password: string) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });

    if (response.data) {
      const { user, token } = response.data as any;
      setAuthToken(token);
      return { user, token };
    }

    throw new Error(response.error || 'Login failed');
  },

  async getCurrentUser() {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await apiRequest('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data) {
      const { user } = response.data as any;
      return user;
    }

    throw new Error(response.error || 'Failed to get current user');
  },

  logout() {
    clearAuthToken();
  },

  getToken: getAuthToken,
};

// User API
export const userAPI = {
  async updateUser(userData: any) {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await apiRequest('/users/me', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (response.data) {
      const { user } = response.data as any;
      return user;
    }

    throw new Error(response.error || 'Failed to update user');
  },

  async getUser(userId: string) {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await apiRequest(`/users/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data) {
      const { user } = response.data as any;
      return user;
    }

    throw new Error(response.error || 'Failed to get user');
  },
};
