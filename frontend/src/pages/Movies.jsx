import { useEffect, useState } from 'react';
import ErrorState from '../components/ErrorState.jsx';
import Loader from '../components/Loader.jsx';
import MovieCard from '../components/MovieCard.jsx';
import { movieService } from '../services/movieService.js';

const defaultFilters = {
  search: '',
  genre: '',
  language: '',
  sort: '-releaseDate',
};

const Movies = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMovies = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const response = await movieService.getMovies({
        ...params,
        page: 1,
        limit: 24,
      });
      setMovies(response.data.data.movies);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load movies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loadMovies(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    loadMovies(defaultFilters);
  };

  return (
    <div className="container">
      <header className="page-header">
        <h2>Now Showing</h2>
        <p>Discover the latest releases and timeless classics.</p>
      </header>

      <form className="filters" onSubmit={handleSubmit}>
        <input
          type="search"
          name="search"
          placeholder="Search by title"
          value={filters.search}
          onChange={handleInputChange}
        />
        <select name="genre" value={filters.genre} onChange={handleInputChange}>
          <option value="">All genres</option>
          <option value="Action">Action</option>
          <option value="Drama">Drama</option>
          <option value="Comedy">Comedy</option>
          <option value="Thriller">Thriller</option>
          <option value="Romance">Romance</option>
        </select>
        <select name="language" value={filters.language} onChange={handleInputChange}>
          <option value="">Any language</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Spanish">Spanish</option>
          <option value="Tamil">Tamil</option>
        </select>
        <select name="sort" value={filters.sort} onChange={handleInputChange}>
          <option value="-releaseDate">Newest first</option>
          <option value="releaseDate">Oldest first</option>
          <option value="-rating">Highest rated</option>
          <option value="rating">Lowest rated</option>
        </select>
        <button type="submit" className="primary-btn">
          Apply
        </button>
        <button type="button" className="secondary-btn" onClick={handleReset}>
          Reset
        </button>
      </form>

      {loading && <Loader />}
      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <section className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
          {movies.length === 0 && (
            <p>No movies match your filters. Try adjusting the search.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default Movies;
