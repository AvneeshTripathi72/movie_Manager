import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="relative overflow-hidden h-96">
        <img
          src={movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button className="btn-primary w-full">
              View Details
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 truncate">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="flex items-center">
            <span className="mr-1">🎭</span>
            {movie.language}
          </span>
          <span className="flex items-center">
            <span className="mr-1">⏱️</span>
            {movie.duration} min
          </span>
        </div>

        {movie.release_date && (
          <div className="mt-2 text-xs text-gray-500">
            Released: {new Date(movie.release_date).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
