import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No booking information found</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const seats = JSON.parse(booking.seats);

  return (
    <div className="min-h-screen gradient-bg py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-500/20 rounded-full mb-4">
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400">Your tickets have been booked successfully</p>
        </div>

        <div className="card p-8 mb-6">
          <div className="text-center mb-6 pb-6 border-b border-dark-700">
            <div className="text-sm text-gray-400 mb-2">Booking ID</div>
            <div className="text-2xl font-bold text-primary-500">{booking.booking_id}</div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Movie</span>
              <span className="text-white font-semibold">{booking.movie_title}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Date</span>
              <span className="text-white">
                {new Date(booking.show_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Time</span>
              <span className="text-white">
                {new Date(`2000-01-01 ${booking.show_time}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Seats</span>
              <span className="text-white font-semibold">{seats.join(', ')}</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-dark-700">
              <span className="text-gray-400 text-lg">Total Amount</span>
              <span className="text-2xl font-bold text-primary-500">₹{booking.total_price}</span>
            </div>
          </div>
        </div>

        <div className="card p-6 mb-6 bg-blue-500/10 border-blue-500">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">Important Information</p>
              <p>Please arrive at the cinema at least 15 minutes before showtime. Carry a valid ID for verification.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/my-bookings')}
            className="btn-primary flex-1"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex-1"
          >
            Book More Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
