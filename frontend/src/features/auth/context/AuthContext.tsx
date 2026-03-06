import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import httpClientManager from '../../../shared/api/httpClient';
import { authApi } from '../api/authApi';
import type { User, RegisterRequest } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const isAuth = await httpClientManager.isAuthenticated();
      if (isAuth) {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn('Auth check failed:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      console.log('í³± LOGIN RESPONSE:', response);
      await httpClientManager.saveTokens({
        accessToken: response.token,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn,
      });
      const userData: User = {
        id: response.userId,
        email: response.email,
        nom: response.nom || '',
        prenom: response.prenom || '',
        role: response.role,
      };
      console.log('í³± SETTING USER:', userData);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (request: RegisterRequest) => {
    try {
      const response = await authApi.register(request);
      console.log('í³± REGISTER RESPONSE:', response);
      await httpClientManager.saveTokens({
        accessToken: response.token,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn,
      });
      const userData: User = {
        id: response.userId,
        email: response.email,
        nom: response.nom || '',
        prenom: response.prenom || '',
        role: response.role,
      };
      console.log('í³± SETTING USER:', userData);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('Logout API failed (ignored):', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      await httpClientManager.clearTokens();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
