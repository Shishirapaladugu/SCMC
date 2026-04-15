import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount — if token exists, verify it with /api/auth/check
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await authAPI.checkAuth();
      if (data.success) setUser(data.user);
      else { localStorage.removeItem('token'); setUser(null); }
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) checkAuth();
    else setLoading(false);
  }, [checkAuth]);

  // signup — body: { fullName, email, password, address }
  // Backend returns: { success, userData, token, message }
  const signup = async (formData) => {
    const { data } = await authAPI.signup(formData);
    if (!data.success) throw new Error(data.message);
    localStorage.setItem('token', data.token);
    setUser(data.userData);
    return data.userData;
  };

  // login — body: { email, password }
  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    if (!data.success) throw new Error(data.message);
    localStorage.setItem('token', data.token);
    setUser(data.userData);
    return data.userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // No role field in your User model — treat every logged-in user as citizen
  // You can add a `role` field to User.js later to enable authority view
  const isAuthority = user?.role === 'authority' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, isAuthority }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
