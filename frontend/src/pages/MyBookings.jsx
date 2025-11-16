import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import Loader from '../components/Loader.jsx';
import { bookingService } from '../services/bookingService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await bookingService.getMyBookings({ page: 1, limit: 20 });
      setBookings(response.data.data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled');
      loadBookings();
    } catch (err) {
      const message = err.response?.data?.message || 'Could not cancel booking.';
      toast.error(message);
    }
  };

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

  return (
    <div className="container grid">
      <header className="page-header">
        <h2>My Bookings</h2>
        <p>Track upcoming visits and manage reservations.</p>
      </header>

      {bookings.length === 0 ? (
        <div className="card">
          <p>You have not booked any shows yet. Browse the latest movies to get started.</p>
          <Link to="/movies" className="primary-btn" style={{ width: 'fit-content' }}>
            Explore Movies
          </Link>
        </div>
      ) : (
        <section className="list">
          {bookings.map((booking) => (
            <article key={booking._id} className="card">
              <header className="list-item" style={{ border: 'none', padding: 0 }}>
                <div>
                  <h3>{booking.showId?.movieId?.title || 'Movie'}</h3>
                  <p className="movie-meta">
                    {booking.showId?.theatreId?.name || 'Theatre'} · {formatDate(booking.showId?.dateTime, 'MMM D, YYYY h:mm A')}
                  </p>
                </div>
                <span className={`badge ${booking.status}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </header>

              <p>Seats: {booking.seats.join(', ')}</p>
              <p>Total Paid: {formatCurrency(booking.totalPrice)}</p>

              <div className="summary-actions" style={{ justifyContent: 'flex-start' }}>
                <Link to={`/bookings/${booking._id}`} className="secondary-btn">
                  View Details
                </Link>
                {booking.status !== 'cancelled' && (
                  <button type="button" className="primary-btn" onClick={() => cancelBooking(booking._id)}>
                    Cancel Booking
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default MyBookings;
