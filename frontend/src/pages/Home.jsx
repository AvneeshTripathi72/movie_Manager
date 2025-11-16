import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <section className="hero">
        <h1>Experience Cinema The Easy Way</h1>
        <p>
          Discover movies, pick your favourite seats, and confirm tickets in minutes. Manage every
          booking from a single dashboard.
        </p>
        <div className="hero-actions">
          <Link to="/movies" className="primary-btn">
            Browse Movies
          </Link>
          <Link to="/register" className="secondary-btn">
            Create Account
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="container feature-grid">
          <article className="feature-card">
            <h3>Smart Seat Selection</h3>
            <p>
              Visual seat map lets you choose the best view. Real-time availability ensures no double
              booking surprises.
            </p>
          </article>
          <article className="feature-card">
            <h3>Instant Confirmations</h3>
            <p>
              Reserve seats with one click and confirm when you are ready. Automated reminders keep you
              on schedule.
            </p>
          </article>
          <article className="feature-card">
            <h3>Unified Dashboard</h3>
            <p>
              Track upcoming shows, download tickets, and manage cancellations from a clean, organized
              interface.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Home;
