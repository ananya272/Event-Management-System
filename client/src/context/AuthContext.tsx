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
      
      if (response.success && response.data?.user && response.data?.token) {
        // Store token and user data in localStorage
        localStorage.setItem('eventManagementToken', response.data.token);
        localStorage.setItem('eventManagementUser', JSON.stringify(response.data.user));
        
        // Set the token in the API service
        apiService.setAuthToken(response.data.token);
        
        // Update the user state
        setUser(response.data.user);
        
        // Verify the user is actually logged in
        const userResponse = await apiService.getCurrentUser();
        if (userResponse.success && userResponse.data?.user) {
          setUser(userResponse.data.user);
          return true;
        } else {
          // If we can't get the current user, clear the session
          localStorage.removeItem('eventManagementToken');
          localStorage.removeItem('eventManagementUser');
          setUser(null);
          setError('Failed to verify user session');
          return false;
        }
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
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