import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Page not found</h2>
        <p>We could not find what you were looking for. Let us take you back to the latest movies.</p>
        <Link to="/movies" className="primary-btn" style={{ marginTop: '1rem', display: 'inline-block' }}>
          Go to Movies
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
