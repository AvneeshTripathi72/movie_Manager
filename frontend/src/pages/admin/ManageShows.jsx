import React, { useState, useEffect } from 'react';
import { showService } from '../../services/showService';
import { movieService } from '../../services/movieService';

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    movie_id: '',
    show_date: '',
    show_time: '',
    price: '',
    total_seats: '100'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [showsRes, moviesRes] = await Promise.all([
        showService.getAllShows(),
        movieService.getAllMovies()
      ]);
      setShows(showsRes.data);
      setMovies(moviesRes.data);
    } catch (err) {
      setError('Failed to load data');
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
      await showService.createShow(formData);
      setShowForm(false);
      setFormData({
        movie_id: '',
        show_date: '',
        show_time: '',
        price: '',
        total_seats: '100'
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create show');
    }
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
          <h1 className="text-4xl font-bold text-white">Manage Shows</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            + Add New Show
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-2xl w-full p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Show</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Movie *</label>
                  <select
                    name="movie_id"
                    value={formData.movie_id}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select a movie</option>
                    {movies.map((movie) => (
                      <option key={movie.id} value={movie.id}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Show Date *</label>
                    <input
                      type="date"
                      name="show_date"
                      value={formData.show_date}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Show Time *</label>
                    <input
                      type="time"
                      name="show_time"
                      value={formData.show_time}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      step="0.01"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Total Seats *</label>
                    <input
                      type="number"
                      name="total_seats"
                      value={formData.total_seats}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Add Show
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300">Movie</th>
                  <th className="px-6 py-4 text-left text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-gray-300">Time</th>
                  <th className="px-6 py-4 text-left text-gray-300">Price</th>
                  <th className="px-6 py-4 text-left text-gray-300">Seats</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show) => (
                  <tr key={show.id} className="border-t border-dark-700 hover:bg-dark-700/50">
                    <td className="px-6 py-4">
                      <div className="text-white font-semibold">{show.movie_title}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(show.show_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(`2000-01-01 ${show.show_time}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-300">₹{show.price}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {show.available_seats} / {show.total_seats}
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

export default ManageShows;
