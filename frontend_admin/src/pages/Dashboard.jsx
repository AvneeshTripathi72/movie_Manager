import { useEffect, useState } from 'react';
import ErrorState from '../components/ErrorState.jsx';
import Loader from '../components/Loader.jsx';
import StatCard from '../components/StatCard.jsx';
import Table from '../components/Table.jsx';
import { adminService } from '../services/adminService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sales, setSales] = useState(null);
  const [topMovies, setTopMovies] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const [salesRes, topMoviesRes, bookingsRes] = await Promise.all([
          adminService.getSalesReport(),
          adminService.getTopMovies(),
          adminService.getAllBookings({ limit: 5 }),
        ]);
        setSales(salesRes.data.data);
        setTopMovies(topMoviesRes.data.data);
        setBookings(bookingsRes.data.data.bookings);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <Loader fullscreen />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="dashboard-grid">
      <section className="stat-grid">
        <StatCard label="Total Revenue" value={formatCurrency(sales?.totalRevenue)} helper="Confirmed bookings" />
        <StatCard label="Bookings" value={sales?.bookingCount ?? 0} helper="All-time confirmed" />
        <StatCard label="Log Files" value={sales?.totalLogs ?? 0} helper="Activity files generated" />
      </section>

      <section className="card">
        <h3>Recent Bookings</h3>
        <Table
          columns={[
            { key: 'user', header: 'User' },
            { key: 'movie', header: 'Movie' },
            { key: 'status', header: 'Status' },
            { key: 'createdAt', header: 'Created' },
          ]}
          rows={bookings.map((booking) => ({
            user: booking.userId?.name || 'Unknown',
            movie: booking.showId?.movieId?.title || 'Unknown',
            status: booking.status,
            createdAt: formatDate(booking.createdAt, 'MMM D, YYYY h:mm A'),
          }))}
          emptyMessage="No bookings yet."
        />
      </section>

      <section className="card">
        <h3>Top Movies</h3>
        <Table
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'bookings', header: 'Bookings' },
            { key: 'revenue', header: 'Revenue' },
          ]}
          rows={topMovies.map((movie) => ({
            title: movie.title,
            bookings: movie.bookings,
            revenue: formatCurrency(movie.revenue),
          }))}
          emptyMessage="No movies to display."
        />
      </section>
    </div>
  );
};

export default Dashboard;
