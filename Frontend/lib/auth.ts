// Authentication API service
const API_BASE_URL = 'http://localhost:8000';

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'hr' | 'admin';
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
  first_name: string;
  last_name: string;
}

export interface RegisterStudentData {
  first_name: string;
  last_name: string;
  email: string;
  academic_year: string;
  department: string;
  password: string;
}

export interface RegisterHRData {
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  password: string;
}

// API Functions
export const authAPI = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  },

  async registerStudent(data: RegisterStudentData): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register/student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  },

  async registerHR(data: RegisterHRData): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register/hr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  },

  async forgotPassword(email: string): Promise<{ message: string; token?: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send reset link');
    }
    return response.json();
  },

  async resetPassword(token: string, new_password: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, new_password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to reset password');
    }
    return response.json();
  },
};

// Token management
export const tokenManager = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('sb:access_token');
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('sb:access_token', token);
  },

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('sb:access_token');
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('sb:user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('sb:user', JSON.stringify(user));
  },

  removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('sb:user');
  },

  logout(): void {
    this.removeToken();
    this.removeUser();
  },
};
