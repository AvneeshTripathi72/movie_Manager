import { useState, useEffect } from 'react';

const MovieForm = ({ movie, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    genre: '',
    director: '',
    duration: '',
    posterUrl: '',
    trailerUrl: '',
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        ...movie,
        releaseDate: movie.releaseDate.split('T')[0], // Format date for input
      });
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{movie ? 'Edit Movie' : 'Add Movie'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
          <input name="releaseDate" type="date" value={formData.releaseDate} onChange={handleChange} required />
          <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" required />
          <input name="director" value={formData.director} onChange={handleChange} placeholder="Director" required />
          <input name="duration" type="number" value={formData.duration} onChange={handleChange} placeholder="Duration (mins)" required />
          <input name="posterUrl" value={formData.posterUrl} onChange={handleChange} placeholder="Poster URL" required />
          <input name="trailerUrl" value={formData.trailerUrl} onChange={handleChange} placeholder="Trailer URL" />
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default MovieForm;
