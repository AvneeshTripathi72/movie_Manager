import { createContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';

export const AuthContext = createContext();

const TOKEN_KEY = 'adminAccessToken';
const REFRESH_KEY = 'adminRefreshToken';

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
        const profile = response.data.data;
        if (profile.role === 'admin') {
          setUser(profile);
        } else {
          window.localStorage.removeItem(TOKEN_KEY);
          window.localStorage.removeItem(REFRESH_KEY);
        }
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(REFRESH_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (payload, redirectTo) => {
    try {
      const response = await authService.login(payload);
      const { accessToken, refreshToken, user: profile } = response.data.data;

      if (profile.role !== 'admin') {
        toast.error('Admin access required');
        return;
      }

      window.localStorage.setItem(TOKEN_KEY, accessToken);
      window.localStorage.setItem(REFRESH_KEY, refreshToken);
      setUser(profile);
      toast.success('Welcome back');
      navigate(redirectTo ?? '/', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw err;
    }
  };

  const logout = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
    setUser(null);
    navigate('/login', { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      setUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
