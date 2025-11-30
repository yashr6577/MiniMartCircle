import { createContext, useEffect, useState } from 'react';
import api from '../utils/api';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  checkAuth: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // Optionally fetch a profile endpoint if available
      // For now, attempt to load products to verify cookie works
      await api.get('/products');
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      await checkAuth();
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup, checkAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
