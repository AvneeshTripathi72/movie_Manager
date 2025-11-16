const MovieTable = ({ movies, onEdit, onDelete }) => (
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Release Date</th>
        <th>Genre</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {movies.map((movie) => (
        <tr key={movie._id}>
          <td>{movie.title}</td>
          <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>
          <td>{movie.genre}</td>
          <td>
            <button onClick={() => onEdit(movie)}>Edit</button>
            <button onClick={() => onDelete(movie._id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default MovieTable;
