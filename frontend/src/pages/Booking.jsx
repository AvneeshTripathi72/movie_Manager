import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import BookingSummary from '../components/BookingSummary.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Loader from '../components/Loader.jsx';
import SeatMap from '../components/SeatMap.jsx';
import { bookingService } from '../services/bookingService.js';
import { showService } from '../services/showService.js';
import { formatDate } from '../utils/formatDate.js';

const defaultContact = {
  email: '',
  phone: '',
  paymentMethod: 'card',
};

const Booking = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking] = useState(null);
  const [contact, setContact] = useState(defaultContact);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [showResponse, seatsResponse] = await Promise.all([
        showService.getShowById(showId),
        showService.getShowSeats(showId),
      ]);
      setShow(showResponse.data.data);
      setAvailableSeats(seatsResponse.data.data.seats);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load show.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId]);

  const totalPrice = useMemo(() => {
    if (!show) return 0;
    return selectedSeats.length * (show.seatPrice || 0);
  }, [selectedSeats, show]);

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((seat) => seat !== seatId) : [...prev, seatId]
    );
  };

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const resetSelection = () => {
    setSelectedSeats([]);
    setBooking(null);
    setContact(defaultContact);
  };

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Select at least one seat.');
      return;
    }

    if (!contact.email || !contact.phone) {
      toast.error('Provide contact details to confirm the booking.');
      return;
    }

    setProcessing(true);
    try {
      let activeBooking = booking;

      if (!activeBooking || activeBooking.status !== 'pending') {
        const reserveResponse = await bookingService.reserveSeats({ showId, seats: selectedSeats });
        activeBooking = reserveResponse.data.data;
        setBooking(activeBooking);
        toast.success('Seats reserved for 10 minutes.');
      }

      const confirmResponse = await bookingService.confirmBooking({
        bookingId: activeBooking._id,
        email: contact.email,
        phone: contact.phone,
        paymentMethod: contact.paymentMethod,
      });

      setBooking(confirmResponse.data.data);
      toast.success('Booking confirmed!');
      navigate('/bookings');
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to confirm booking.';
      toast.error(message);
      if (err.response?.status === 409) {
        loadData();
      }
    } finally {
      setProcessing(false);
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

  if (!show) {
    return (
      <div className="container">
        <ErrorState title="Show not found" message="Please choose another screening." />
      </div>
    );
  }

  const screenLayout = show.screenId?.layout;

  return (
    <div className="container grid">
      <section className="card">
        <h2>{show.movieId?.title}</h2>
        <p className="movie-meta">
          {show.theatreId?.name} · {dayjs(show.dateTime).format('MMM D, YYYY h:mm A')} · {show.format}
        </p>
        <p>
          Seat price {show.seatPrice ? `$${show.seatPrice.toFixed(2)}` : 'Not available'} · Available
          seats {availableSeats.length}
        </p>
        <SeatMap
          layout={screenLayout}
          availableSeats={availableSeats}
          selectedSeats={selectedSeats}
          onToggle={toggleSeat}
        />
      </section>

      <section className="card">
        <BookingSummary
          seats={selectedSeats}
          seatPrice={show.seatPrice || 0}
          show={show}
          onConfirm={handleConfirm}
          onCancel={resetSelection}
          loading={processing}
        />

        <form className="grid" onSubmit={(event) => event.preventDefault()}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={contact.email}
              onChange={handleContactChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={contact.phone}
              onChange={handleContactChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={contact.paymentMethod}
              onChange={handleContactChange}
            >
              <option value="card">Credit or Debit Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
              <option value="cash">Pay at Counter</option>
            </select>
          </div>
        </form>
        {booking && (
          <p className="badge pending">
            Booking expires at {formatDate(booking.expiresAt, 'MMM D, YYYY h:mm A')}
          </p>
        )}
        <p>Total: ${totalPrice.toFixed(2)}</p>
      </section>
    </div>
  );
};

export default Booking;
