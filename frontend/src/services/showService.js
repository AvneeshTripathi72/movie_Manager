import api from './api';

export const showService = {
  getShowsByMovie: async (movieId) => {
    const response = await api.get(`/shows/${movieId}`);
    return response.data;
  },

  getShowById: async (id) => {
    const response = await api.get(`/shows/detail/${id}`);
    return response.data;
  },

  getAllShows: async () => {
    const response = await api.get('/shows');
    return response.data;
  },

  createShow: async (showData) => {
    const response = await api.post('/shows', showData);
    return response.data;
  }
};
