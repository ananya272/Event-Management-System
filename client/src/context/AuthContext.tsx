import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('eventManagementToken');
    const savedUser = localStorage.getItem('eventManagementUser');
    
    if (token && savedUser) {
      // Verify token with backend
      apiService.getCurrentUser()
        .then(response => {
          if (response.success && response.data?.user) {
            setUser(response.data.user);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('eventManagementToken');
            localStorage.removeItem('eventManagementUser');
          }
        })
        .catch(() => {
          // Token is invalid, clear storage
          localStorage.removeItem('eventManagementToken');
          localStorage.removeItem('eventManagementUser');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store token and user data
        localStorage.setItem('eventManagementToken', token);
        localStorage.setItem('eventManagementUser', JSON.stringify(user));
        
        setUser(user);
        setIsLoading(false);
        return true;
      } else {
        setError(response.message || 'Login failed');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('eventManagementToken');
    localStorage.removeItem('eventManagementUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};