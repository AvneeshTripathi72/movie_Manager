import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import ErrorState from '../components/ErrorState.jsx';
import Loader from '../components/Loader.jsx';
import { adminService } from '../services/adminService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);
  const [salesReport, setSalesReport] = useState(null);
  const [topMovies, setTopMovies] = useState([]);
  const [activitySummary, setActivitySummary] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [bookingsRes, salesRes, topMoviesRes, summaryRes] = await Promise.all([
        adminService.getAllBookings({ limit: 10 }),
        adminService.getSalesReport(),
        adminService.getTopMovies(),
        adminService.getActivitySummary(),
      ]);

      setBookings(bookingsRes.data.data.bookings);
      setSalesReport(salesRes.data.data);
      setTopMovies(topMoviesRes.data.data);
      setActivitySummary(summaryRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateBookingStatus = async (bookingId, action) => {
    try {
      if (action === 'confirm') {
        await adminService.manualConfirmBooking({ bookingId });
        toast.success('Booking confirmed');
      } else {
        await adminService.manualCancelBooking({ bookingId });
        toast.success('Booking cancelled');
      }
      loadData();
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to update booking.';
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
    <div className="container admin-grid">
      <header className="page-header">
        <h2>Admin Dashboard</h2>
        <p>Monitor performance, see bookings, and review user activity.</p>
      </header>

      <section className="admin-columns">
        <article className="card">
          <h3>Total Revenue</h3>
          <p className="hero-number">{formatCurrency(salesReport?.totalRevenue)}</p>
          <p>{salesReport?.bookingCount || 0} confirmed bookings</p>
        </article>
        <article className="card">
          <h3>Activity Summary</h3>
          <p>{activitySummary?.stats?.totalActivities || 0} recorded actions</p>
          <p>{activitySummary?.totalLogsGenerated || 0} log files</p>
        </article>
      </section>

      <section className="card">
        <h3 className="section-title">Recent Bookings</h3>
        <div className="list">
          {bookings.map((booking) => (
            <div key={booking._id} className="list-item">
              <div>
                <h4>{booking.userId?.name || 'User'}</h4>
                <p className="movie-meta">
                  {booking.showId?.movieId?.title || 'Movie'} · {formatDate(booking.createdAt, 'MMM D, YYYY h:mm A')}
                </p>
                <span className={`badge ${booking.status}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              <div className="summary-actions" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="secondary-btn" onClick={() => updateBookingStatus(booking._id, 'cancel')}>
                  Cancel
                </button>
                <button type="button" className="primary-btn" onClick={() => updateBookingStatus(booking._id, 'confirm')}>
                  Confirm
                </button>
              </div>
            </div>
          ))}
          {bookings.length === 0 && <p>No bookings to display.</p>}
        </div>
      </section>

      <section className="card">
        <h3 className="section-title">Top Movies</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Bookings</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topMovies.map((movie) => (
              <tr key={movie.movieId}>
                <td>{movie.title}</td>
                <td>{movie.bookings}</td>
                <td>{formatCurrency(movie.revenue)}</td>
              </tr>
            ))}
            {topMovies.length === 0 && (
              <tr>
                <td colSpan="3">No data available yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
