import { api } from './api.js';

export const movieService = {
  getMovies: (params) => api.get('/movies', { params }),
  getMovieById: (id) => api.get(`/movies/${id}`),
};
