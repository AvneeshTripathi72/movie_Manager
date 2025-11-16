import { api } from './api.js';

export const bookingService = {
  reserveSeats: (payload) => api.post('/bookings/reserve', payload),
  confirmBooking: (payload) => api.post('/bookings/confirm', payload),
  getMyBookings: (params) => api.get('/bookings', { params }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
};
