import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../../services/movieService';
import { bookingService } from '../../services/bookingService';
import { showService } from '../../services/showService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalShows: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [moviesRes, showsRes, bookingsRes] = await Promise.all([
        movieService.getAllMovies(),
        showService.getAllShows(),
        bookingService.getAllBookings()
      ]);

      const totalRevenue = bookingsRes.data.reduce((sum, booking) => {
        return sum + parseFloat(booking.total_price);
      }, 0);

      setStats({
        totalMovies: moviesRes.count,
        totalShows: showsRes.count,
        totalBookings: bookingsRes.count,
        totalRevenue: totalRevenue
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Movies',
      value: stats.totalMovies,
      icon: '🎬',
      color: 'from-blue-500 to-blue-700',
      link: '/admin/movies'
    },
    {
      title: 'Total Shows',
      value: stats.totalShows,
      icon: '🎭',
      color: 'from-purple-500 to-purple-700',
      link: '/admin/shows'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: '🎫',
      color: 'from-green-500 to-green-700',
      link: '/admin/bookings'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'from-yellow-500 to-yellow-700',
      link: '/admin/bookings'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your movie booking system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="card p-6 hover:scale-105 transition-transform duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{stat.icon}</div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white font-bold`}>
                  →
                </div>
              </div>
              <div className="text-gray-400 text-sm mb-1">{stat.title}</div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/movies"
              className="p-6 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors border border-dark-600 hover:border-primary-600"
            >
              <div className="text-3xl mb-3">🎬</div>
              <h3 className="text-lg font-semibold text-white mb-2">Manage Movies</h3>
              <p className="text-gray-400 text-sm">Add, edit, or delete movies</p>
            </Link>

            <Link
              to="/admin/shows"
              className="p-6 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors border border-dark-600 hover:border-primary-600"
            >
              <div className="text-3xl mb-3">🎭</div>
              <h3 className="text-lg font-semibold text-white mb-2">Manage Shows</h3>
              <p className="text-gray-400 text-sm">Create and manage showtimes</p>
            </Link>

            <Link
              to="/admin/bookings"
              className="p-6 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors border border-dark-600 hover:border-primary-600"
            >
              <div className="text-3xl mb-3">🎫</div>
              <h3 className="text-lg font-semibold text-white mb-2">View Bookings</h3>
              <p className="text-gray-400 text-sm">Monitor all customer bookings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
