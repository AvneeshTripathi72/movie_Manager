import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-4xl font-bold text-white mb-8">My Bookings</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const isPast = new Date(`${booking.show_date} ${booking.show_time}`) < new Date();
              
              return (
                <div key={booking.id} className="card p-6">
                  <div className="flex gap-6">
                    <img
                      src={booking.poster_url || 'https://via.placeholder.com/150x225'}
                      alt={booking.movie_title}
                      className="w-32 h-48 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {booking.movie_title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm">
                            <span className={`px-3 py-1 rounded-full ${
                              booking.status === 'confirmed'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            {isPast && (
                              <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400">
                                Past Show
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-400 mb-1">Booking ID</div>
                          <div className="text-primary-500 font-semibold">{booking.booking_id}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Date</div>
                          <div className="text-white">
                            {new Date(booking.show_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-400 mb-1">Time</div>
                          <div className="text-white">
                            {new Date(`2000-01-01 ${booking.show_time}`).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-400 mb-1">Seats</div>
                          <div className="text-white font-semibold">
                            {booking.seats.join(', ')}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-400 mb-1">Total Amount</div>
                          <div className="text-primary-500 font-bold text-lg">
                            ₹{booking.total_price}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Booked on {new Date(booking.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl text-gray-400 mb-4">No bookings yet</h3>
            <p className="text-gray-500 mb-6">Start booking your favorite movies now!</p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Browse Movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
