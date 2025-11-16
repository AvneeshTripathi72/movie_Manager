import { api } from './api.js';

export const showService = {
  getShows: (params) => api.get('/shows', { params }),
  getShowById: (id) => api.get(`/shows/${id}`),
  getShowSeats: (id) => api.get(`/shows/${id}/seats`),
};
