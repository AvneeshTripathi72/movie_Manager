import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import Loader from '../components/Loader.jsx';
import { bookingService } from '../services/bookingService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';

const BookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBooking = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await bookingService.getBookingById(bookingId);
      setBooking(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load booking.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const handleCancel = async () => {
    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled');
      navigate('/bookings');
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

  if (!booking) {
    return (
      <div className="container">
        <ErrorState title="Not found" message="This booking no longer exists." />
      </div>
    );
  }

  const show = booking.showId;

  return (
    <div className="container grid">
      <section className="card">
        <h2>Booking Summary</h2>
        <p className={`badge ${booking.status}`}>
          Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </p>
        <dl>
          <div className="summary-row">
            <dt>Movie</dt>
            <dd>{show?.movieId?.title || 'Movie'}</dd>
          </div>
          <div className="summary-row">
            <dt>Theatre</dt>
            <dd>{show?.theatreId?.name || 'Theatre'}</dd>
          </div>
          <div className="summary-row">
            <dt>Showtime</dt>
            <dd>{formatDate(show?.dateTime, 'MMM D, YYYY h:mm A')}</dd>
          </div>
          <div className="summary-row">
            <dt>Seats</dt>
            <dd>{booking.seats.join(', ')}</dd>
          </div>
          <div className="summary-row">
            <dt>Total Paid</dt>
            <dd>{formatCurrency(booking.totalPrice)}</dd>
          </div>
          <div className="summary-row">
            <dt>Payment Method</dt>
            <dd>{booking.paymentMethod || 'Not available'}</dd>
          </div>
          <div className="summary-row">
            <dt>Booked On</dt>
            <dd>{formatDate(booking.createdAt, 'MMM D, YYYY h:mm A')}</dd>
          </div>
        </dl>
        {booking.status !== 'cancelled' && (
          <button type="button" className="primary-btn" onClick={handleCancel}>
            Cancel Booking
          </button>
        )}
      </section>
    </div>
  );
};

export default BookingDetail;
