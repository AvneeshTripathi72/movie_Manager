const BookingSummary = ({
  seats = [],
  seatPrice = 0,
  show,
  onConfirm,
  onCancel,
  loading,
}) => {
  const total = seats.length * seatPrice;

  return (
    <div className="booking-summary">
      <h3>Booking Summary</h3>
      <dl>
        <div className="summary-row">
          <dt>Movie</dt>
          <dd>{show?.movieId?.title || show?.movie?.title || 'Unknown'}</dd>
        </div>
        <div className="summary-row">
          <dt>Theatre</dt>
          <dd>{show?.theatreId?.name || 'Unknown'}</dd>
        </div>
        <div className="summary-row">
          <dt>Seats</dt>
          <dd>{seats.length ? seats.join(', ') : 'None selected'}</dd>
        </div>
        <div className="summary-row">
          <dt>Seat Price</dt>
          <dd>${seatPrice.toFixed(2)}</dd>
        </div>
        <div className="summary-row total">
          <dt>Total</dt>
          <dd>${total.toFixed(2)}</dd>
        </div>
      </dl>
      <div className="summary-actions">
        <button type="button" onClick={onCancel} className="secondary-btn">
          Clear
        </button>
        <button type="button" onClick={onConfirm} className="primary-btn" disabled={seats.length === 0 || loading}>
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
