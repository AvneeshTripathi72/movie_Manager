import { api } from './api.js';

export const theatreService = {
  getTheatres: (params) => api.get('/theatres', { params }),
  getTheatreById: (id) => api.get(`/theatres/${id}`),
};
