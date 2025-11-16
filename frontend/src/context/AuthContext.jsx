import { createContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';

export const AuthContext = createContext();

const TOKEN_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getCurrentUser()
      .then((response) => {
        setUser(response.data.data);
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(REFRESH_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials, options = {}) => {
    try {
      const response = await authService.login(credentials);
      const { accessToken, refreshToken, user: profile } = response.data.data;
      window.localStorage.setItem(TOKEN_KEY, accessToken);
      window.localStorage.setItem(REFRESH_KEY, refreshToken);
      setUser(profile);
      toast.success('Welcome back!');
      navigate(options.redirectTo ?? '/movies', { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const register = async (payload, options = {}) => {
    try {
      const response = await authService.register(payload);
      const { accessToken, refreshToken, user: profile } = response.data.data;
      window.localStorage.setItem(TOKEN_KEY, accessToken);
      window.localStorage.setItem(REFRESH_KEY, refreshToken);
      setUser(profile);
      toast.success('Account created successfully');
      navigate(options.redirectTo ?? '/movies', { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
    setUser(null);
    toast.success('Logged out');
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      setUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
