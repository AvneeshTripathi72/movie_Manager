import React, { useState, useEffect } from 'react';
import { movieService } from '../../services/movieService';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    language: '',
    poster_url: '',
    release_date: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getAllMovies();
      setMovies(response.data);
    } catch (err) {
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingMovie) {
        await movieService.updateMovie(editingMovie.id, formData);
      } else {
        await movieService.createMovie(formData);
      }
      
      setShowForm(false);
      setEditingMovie(null);
      setFormData({
        title: '',
        description: '',
        duration: '',
        language: '',
        poster_url: '',
        release_date: ''
      });
      fetchMovies();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description || '',
      duration: movie.duration,
      language: movie.language,
      poster_url: movie.poster_url || '',
      release_date: movie.release_date ? movie.release_date.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;

    try {
      await movieService.deleteMovie(id);
      fetchMovies();
    } catch (err) {
      setError('Failed to delete movie');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMovie(null);
    setFormData({
      title: '',
      description: '',
      duration: '',
      language: '',
      poster_url: '',
      release_date: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Manage Movies</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            + Add New Movie
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Movie Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Duration (minutes) *</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Language *</label>
                    <input
                      type="text"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Poster URL</label>
                  <input
                    type="url"
                    name="poster_url"
                    value={formData.poster_url}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Release Date</label>
                  <input
                    type="date"
                    name="release_date"
                    value={formData.release_date}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingMovie ? 'Update Movie' : 'Add Movie'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Movies Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300">Movie</th>
                  <th className="px-6 py-4 text-left text-gray-300">Language</th>
                  <th className="px-6 py-4 text-left text-gray-300">Duration</th>
                  <th className="px-6 py-4 text-left text-gray-300">Release Date</th>
                  <th className="px-6 py-4 text-right text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id} className="border-t border-dark-700 hover:bg-dark-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={movie.poster_url || 'https://via.placeholder.com/50x75'}
                          alt={movie.title}
                          className="w-12 h-18 object-cover rounded"
                        />
                        <div>
                          <div className="text-white font-semibold">{movie.title}</div>
                          <div className="text-gray-400 text-sm line-clamp-1">
                            {movie.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{movie.language}</td>
                    <td className="px-6 py-4 text-gray-300">{movie.duration} min</td>
                    <td className="px-6 py-4 text-gray-300">
                      {movie.release_date
                        ? new Date(movie.release_date).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(movie)}
                        className="text-blue-500 hover:text-blue-400 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMovies;
