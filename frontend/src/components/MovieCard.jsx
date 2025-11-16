import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate.js';

const MovieCard = ({ movie }) => {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} loading="lazy" />
        ) : (
          <div className="poster-placeholder">No poster</div>
        )}
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-meta">
          {movie.genre?.join(', ')} · {movie.duration} min
        </p>
        <p className="movie-description">{movie.description}</p>
        <div className="movie-footer">
          <span className="movie-rating">Rating: {movie.rating ?? 'N/A'}</span>
          <span className="movie-release">Released {formatDate(movie.releaseDate)}</span>
        </div>
        <Link to={`/movies/${movie._id}`} className="primary-link">
          View Details
        </Link>
      </div>
    </article>
  );
};

export default MovieCard;
