import { api } from './api';

export const movieService = {
  getAllMovies: () => api.get('/movies'),
  getMovieById: (id) => api.get(`/movies/${id}`),
  createMovie: (data) => api.post('/movies', data),
  updateMovie: (id, data) => api.put(`/movies/${id}`, data),
  deleteMovie: (id) => api.delete(`/movies/${id}`),
};
