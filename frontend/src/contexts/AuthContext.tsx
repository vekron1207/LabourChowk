import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';
import { User, UserRole, Language } from '../types';
import { logger } from '../utils/logger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (phone: string, password: string, role: UserRole, language?: Language) => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = authAPI.getToken();

      if (token) {
        try {
          const currentUser = await authAPI.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          logger.error('Failed to get current user:', error);
          authAPI.logout();
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const register = async (
    phone: string,
    password: string,
    role: UserRole,
    language: Language = 'hi'
  ): Promise<void> => {
    try {
      const { user } = await authAPI.register(phone, password, role, language);
      setUser(user);
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (phone: string, password: string): Promise<void> => {
    try {
      const { user } = await authAPI.login(phone, password);
      setUser(user);
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      authAPI.logout();
      setUser(null);
      localStorage.removeItem('selectedRole');
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      const updatedUser = await userAPI.updateUser(userData);
      setUser(updatedUser);
    } catch (error) {
      logger.error('Update user error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
