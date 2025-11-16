import { api } from './api.js';

export const authService = {
  login: (payload) => api.post('/auth/login', payload),
  getCurrentUser: () => api.get('/auth/me'),
};
