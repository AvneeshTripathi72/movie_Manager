import { api } from './api.js';

export const adminService = {
  getAllBookings: (params) => api.get('/admin/bookings', { params }),
  manualConfirmBooking: (payload) => api.post('/admin/bookings/confirm', payload),
  manualCancelBooking: (payload) => api.post('/admin/bookings/cancel', payload),
  getSalesReport: () => api.get('/admin/reports/sales'),
  getTopMovies: () => api.get('/admin/reports/top-movies'),
  getActivityLogs: (params) => api.get('/admin/activity-logs', { params }),
  getActivitySummary: () => api.get('/admin/activity-logs/summary'),
};
