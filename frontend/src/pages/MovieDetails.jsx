import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { showService } from '../services/showService';
import { useAuth } from '../context/AuthContext';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovieAndShows();
  }, [id]);

  const fetchMovieAndShows = async () => {
    try {
      setLoading(true);
      const [movieRes, showsRes] = await Promise.all([
        movieService.getMovieById(id),
        showService.getShowsByMovie(id)
      ]);
      
      setMovie(movieRes.data);
      setShows(showsRes.data);
    } catch (err) {
      setError('Failed to load movie details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookShow = (showId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/seat-selection/${showId}`);
  };

  const groupShowsByDate = () => {
    const grouped = {};
    shows.forEach(show => {
      const date = new Date(show.show_date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(show);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Movie not found'}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const groupedShows = groupShowsByDate();

  return (
    <div className="min-h-screen gradient-bg">
      <div className="relative h-96 bg-dark-800">
        <div className="absolute inset-0">
          <img
            src={movie.poster_url || 'https://via.placeholder.com/1920x1080'}
            alt={movie.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="flex items-end h-full pb-8">
            <div className="flex gap-6">
              <img
                src={movie.poster_url || 'https://via.placeholder.com/300x450'}
                alt={movie.title}
                className="w-48 h-72 object-cover rounded-lg shadow-2xl border-2 border-dark-700"
              />
              
              <div className="flex-1 text-white pb-4">
                <h1 className="text-5xl font-bold mb-4 text-shadow">{movie.title}</h1>
                
                <div className="flex items-center gap-6 text-gray-300 mb-4">
                  <span className="flex items-center">
                    <span className="mr-2">🎭</span>
                    {movie.language}
                  </span>
                  <span className="flex items-center">
                    <span className="mr-2">⏱️</span>
                    {movie.duration} min
                  </span>
                  {movie.release_date && (
                    <span className="flex items-center">
                      <span className="mr-2">📅</span>
                      {new Date(movie.release_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                {movie.description && (
                  <p className="text-gray-300 max-w-3xl leading-relaxed">
                    {movie.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Select Showtime</h2>
        
        {shows.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedShows).map(([date, dateShows]) => (
              <div key={date} className="card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{date}</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {dateShows.map((show) => (
                    <button
                      key={show.id}
                      onClick={() => handleBookShow(show.id)}
                      disabled={show.available_seats === 0}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        show.available_seats === 0
                          ? 'border-gray-700 bg-gray-800 text-gray-600 cursor-not-allowed'
                          : 'border-primary-600 bg-dark-700 hover:bg-primary-600 text-white hover:shadow-lg transform hover:-translate-y-1'
                      }`}
                    >
                      <div className="text-lg font-bold">
                        {new Date(`2000-01-01 ${show.show_time}`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </div>
                      <div className="text-sm mt-1">₹{show.price}</div>
                      <div className="text-xs mt-1 text-gray-400">
                        {show.available_seats} seats left
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-gray-400 text-lg">No showtimes available for this movie</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
