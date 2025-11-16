import { useEffect, useState } from 'react';
import ErrorState from '../components/ErrorState.jsx';
import Loader from '../components/Loader.jsx';
import Table from '../components/Table.jsx';
import { adminService } from '../services/adminService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';

const Bookings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.getAllBookings({ limit: 20 });
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

  if (loading) {
    return <Loader fullscreen />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="card">
      <div className="table-toolbar">
        <h3>All Bookings</h3>
        <button type="button" onClick={loadBookings}>
          Refresh
        </button>
      </div>
      <Table
        columns={[
          { key: 'user', header: 'User' },
          { key: 'movie', header: 'Movie' },
          { key: 'seats', header: 'Seats' },
          { key: 'status', header: 'Status' },
          { key: 'totalPrice', header: 'Total' },
          { key: 'createdAt', header: 'Created' },
        ]}
        rows={bookings.map((booking) => ({
          user: booking.userId?.name || 'Unknown',
          movie: booking.showId?.movieId?.title || 'Unknown',
          seats: booking.seats.join(', '),
          status: booking.status,
          totalPrice: formatCurrency(booking.totalPrice),
          createdAt: formatDate(booking.createdAt, 'MMM D, YYYY h:mm A'),
        }))}
      />
    </div>
  );
};

export default Bookings;
