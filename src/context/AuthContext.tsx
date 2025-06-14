import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_URL = Platform.select({
  android: 'http://10.0.2.2:8082/api',
  ios: 'http://localhost:8082/api',
  default: 'http://192.168.1.100:8082/api'
});

// Axios instance oluşturma
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 saniye timeout
});

// Axios interceptor ekleme
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      baseURL: config.baseURL,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', {
      message: error.message,
      config: error.config,
      code: error.code
    });
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      message: error.message,
      code: error.code,
      response: {
        data: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers
      },
      request: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data) {
        const userData = {
          id: response.data.id,
          name: response.data.name,
          surname: response.data.surname,
          email: response.data.email,
        };
        setUser(userData);
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (err: any) {
      console.error('Login error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Giriş yapılırken bir hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Register request starting:', { 
        name, 
        email,
        apiUrl: API_URL,
        platform: Platform.OS
      });
      
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      console.log('Register response received:', {
        status: response.status,
        data: response.data
      });

      if (response.data) {
        const userData = {
          id: response.data.id,
          name: response.data.name,
          surname: response.data.surname,
          email: response.data.email,
        };
        setUser(userData);
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (err: any) {
      console.error('Register error details:', {
        message: err.message,
        code: err.code,
        response: {
          data: err.response?.data,
          status: err.response?.status,
          statusText: err.response?.statusText,
          headers: err.response?.headers
        },
        request: {
          url: err.config?.url,
          method: err.config?.method,
          baseURL: err.config?.baseURL,
          headers: err.config?.headers,
          data: err.config?.data
        },
        stack: err.stack
      });
      
      let errorMessage = 'Kayıt olurken bir hata oluştu';
      
      if (err.response) {
        // Backend'den gelen hata mesajı
        errorMessage = err.response.data?.message || errorMessage;
        console.error('Backend error:', err.response.data);
      } else if (err.request) {
        // İstek yapıldı ama yanıt alınamadı
        errorMessage = 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.';
        console.error('Network error:', err.request);
      } else {
        // İstek oluşturulurken hata oluştu
        errorMessage = err.message || errorMessage;
        console.error('Request setup error:', err.message);
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 