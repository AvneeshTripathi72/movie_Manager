import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatGrid from '../components/SeatGrid';
import { showService } from '../services/showService';
import { bookingService } from '../services/bookingService';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  const fetchShowDetails = async () => {
    try {
      setLoading(true);
      const response = await showService.getShowById(showId);
      setShow(response.data);
      
      // For demo purposes, we'll simulate some booked seats
      // In a real app, this would come from the backend
      const totalSeats = response.data.total_seats;
      const availableSeats = response.data.available_seats;
      const bookedCount = totalSeats - availableSeats;
      
      // Generate some random booked seats for demo
      const booked = [];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      for (let i = 0; i < bookedCount; i++) {
        const row = rows[Math.floor(Math.random() * Math.min(rows.length, Math.ceil(totalSeats / 10)))];
        const seat = Math.floor(Math.random() * 10) + 1;
        const seatNumber = `${row}${seat}`;
        if (!booked.includes(seatNumber)) {
          booked.push(seatNumber);
        }
      }
      setBookedSeats(booked);
    } catch (err) {
      setError('Failed to load show details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    setBooking(true);
    setError('');

    try {
      const response = await bookingService.createBooking({
        show_id: showId,
        seats: selectedSeats
      });

      if (response.success) {
        navigate('/booking-confirmation', { 
          state: { booking: response.data } 
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !show) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = selectedSeats.length * show.price;

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/movie/${show.movie_id}`)}
            className="text-gray-400 hover:text-white mb-4 flex items-center"
          >
            ← Back to Movie
          </button>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{show.movie_title}</h1>
                <div className="flex items-center gap-4 text-gray-400">
                  <span>
                    {new Date(show.show_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span>
                    {new Date(`2000-01-01 ${show.show_time}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                  <span>₹{show.price} per seat</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-gray-400 text-sm">Available Seats</div>
                <div className="text-2xl font-bold text-primary-500">{show.available_seats}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Seat Selection */}
        <div className="card p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Select Your Seats</h2>
          
          <SeatGrid
            totalSeats={show.total_seats}
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
          />
        </div>

        {/* Booking Summary */}
        <div className="card p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-gray-400 text-sm mb-1">Selected Seats</div>
              <div className="text-white font-semibold">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-gray-400 text-sm mb-1">Total Amount</div>
              <div className="text-3xl font-bold text-primary-500">₹{totalPrice}</div>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={selectedSeats.length === 0 || booking}
            className="btn-primary w-full text-lg"
          >
            {booking ? 'Processing...' : `Book ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
