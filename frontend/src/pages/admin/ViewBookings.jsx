import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.booking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.movie_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-4xl font-bold text-white mb-8">All Bookings</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by booking ID, movie, user name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field max-w-md"
          />
        </div>

        {/* Bookings Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300">Booking ID</th>
                  <th className="px-6 py-4 text-left text-gray-300">User</th>
                  <th className="px-6 py-4 text-left text-gray-300">Movie</th>
                  <th className="px-6 py-4 text-left text-gray-300">Show Details</th>
                  <th className="px-6 py-4 text-left text-gray-300">Seats</th>
                  <th className="px-6 py-4 text-left text-gray-300">Amount</th>
                  <th className="px-6 py-4 text-left text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-dark-700 hover:bg-dark-700/50">
                    <td className="px-6 py-4">
                      <div className="text-primary-500 font-semibold">{booking.booking_id}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(booking.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{booking.user_name}</div>
                      <div className="text-sm text-gray-400">{booking.user_email}</div>
                    </td>
                    <td className="px-6 py-4 text-white">{booking.movie_title}</td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">
                        {new Date(booking.show_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(`2000-01-01 ${booking.show_time}`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {booking.seats.join(', ')}
                    </td>
                    <td className="px-6 py-4 text-primary-500 font-semibold">
                      ₹{booking.total_price}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === 'confirmed'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              {searchTerm ? 'No bookings found matching your search' : 'No bookings yet'}
            </div>
          )}
        </div>

        {/* Summary */}
        {bookings.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="text-gray-400 text-sm mb-1">Total Bookings</div>
              <div className="text-2xl font-bold text-white">{bookings.length}</div>
            </div>
            <div className="card p-4">
              <div className="text-gray-400 text-sm mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-primary-500">
                ₹{bookings.reduce((sum, b) => sum + parseFloat(b.total_price), 0).toLocaleString()}
              </div>
            </div>
            <div className="card p-4">
              <div className="text-gray-400 text-sm mb-1">Total Seats Booked</div>
              <div className="text-2xl font-bold text-white">
                {bookings.reduce((sum, b) => sum + b.seats.length, 0)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBookings;
