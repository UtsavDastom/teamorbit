import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('orbit_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('orbit_token');
      if (token) {
        try {
          const { data } = await api.get('/api/auth/me');
          setUser(data);
          localStorage.setItem('orbit_user', JSON.stringify(data));
        } catch {
          localStorage.removeItem('orbit_token');
          localStorage.removeItem('orbit_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('orbit_token', data.token);
    localStorage.setItem('orbit_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await api.post('/api/auth/register', { name, email, password, role });
    localStorage.setItem('orbit_token', data.token);
    localStorage.setItem('orbit_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('orbit_token');
    localStorage.removeItem('orbit_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
