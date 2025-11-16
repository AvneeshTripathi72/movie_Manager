import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { movieService } from '../services/movieService'; 
import MovieForm from '../components/MovieForm';
import MovieTable from '../components/MovieTable';

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getAllMovies();
      setMovies(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch movies.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormOpen = (movie = null) => {
    setSelectedMovie(movie);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedMovie(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedMovie) {
        await movieService.updateMovie(selectedMovie._id, formData);
        toast.success('Movie updated successfully!');
      } else {
        await movieService.createMovie(formData);
        toast.success('Movie added successfully!');
      }
      fetchMovies();
      handleFormClose();
    } catch (error) {
      toast.error('Failed to save movie.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await movieService.deleteMovie(id);
        toast.success('Movie deleted successfully!');
        fetchMovies();
      } catch (error) {
        toast.error('Failed to delete movie.');
      }
    }
  };

  return (
    <div className="container">
      <h1>Movie Management</h1>
      <button onClick={() => handleFormOpen()}>Add Movie</button>
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <MovieTable movies={movies} onEdit={handleFormOpen} onDelete={handleDelete} />
      )}
      {isFormOpen && (
        <MovieForm
          movie={selectedMovie}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default MovieManagement;
