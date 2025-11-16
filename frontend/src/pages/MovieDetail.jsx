import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import Loader from '../components/Loader.jsx';
import { movieService } from '../services/movieService.js';
import { showService } from '../services/showService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [movieResponse, showResponse] = await Promise.all([
          movieService.getMovieById(movieId),
          showService.getShows({ movieId, limit: 10 }),
        ]);

        setMovie(movieResponse.data.data);
        setShows(showResponse.data.data.shows);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load movie.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (loading) {
    return <Loader fullscreen />;
  }

  if (error) {
    return (
      <div className="container">
        <ErrorState message={error} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container">
        <ErrorState title="Movie not found" message="Please go back and try another title." />
      </div>
    );
  }

  return (
    <div className="container grid">
      <section className="card">
        <div className="movie-detail">
          <div className="poster-wrapper" style={{ maxWidth: '320px' }}>
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} />
            ) : (
              <div className="poster-placeholder">No poster</div>
            )}
          </div>
          <div className="movie-info">
            <h2>{movie.title}</h2>
            <p className="movie-meta">
              {movie.genre?.join(', ')} · {movie.duration} minutes · {movie.language?.join(', ')}
            </p>
            <p>{movie.description}</p>
            <div className="movie-footer">
              <span>Directed by {movie.director}</span>
              <span>Released {formatDate(movie.releaseDate)}</span>
            </div>
            {movie.cast?.length > 0 && (
              <p>
                <strong>Cast:</strong> {movie.cast.join(', ')}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="section-title">Upcoming Shows</h3>
        {shows.length === 0 && <p>No shows scheduled yet. Check back soon.</p>}
        <div className="list">
          {shows.map((show) => (
            <div key={show._id} className="list-item">
              <div>
                <h4>{show.theatreId?.name || 'Unnamed Theatre'}</h4>
                <p className="movie-meta">
                  {dayjs(show.dateTime).format('MMM D, YYYY h:mm A')} · {show.format} · {show.language}
                </p>
                <span className="tag">{formatCurrency(show.seatPrice)}</span>
              </div>
              <Link to={`/shows/${show._id}/book`} className="primary-link">
                Select Seats
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieDetail;
