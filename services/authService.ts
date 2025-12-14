import { User } from '../types';

// Mock user for demo purposes
const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Traveler',
  email: 'alex@plango.com',
  avatar: 'https://picsum.photos/200'
};

const STORAGE_KEY_TOKEN = 'plango_auth_token';

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email && password) {
      const token = 'mock-jwt-token-xyz-123';
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
      return { user: MOCK_USER, token };
    }
    throw new Error('Invalid credentials');
  },

  signup: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newUser = { ...MOCK_USER, name, email };
    const token = 'mock-jwt-token-new-user';
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    return { user: newUser, token };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  },

  getCurrentUser: async (): Promise<User | null> => {
    // Check if token exists
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (!token) return null;
    
    // Simulate verifying token
    return MOCK_USER;
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEY_TOKEN);
  }
};