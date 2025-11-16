import { useMemo } from 'react';

const SeatMap = ({ layout, availableSeats = [], selectedSeats = [], onToggle }) => {
  const availableSet = useMemo(() => new Set(availableSeats), [availableSeats]);
  const selectedSet = useMemo(() => new Set(selectedSeats), [selectedSeats]);

  if (!layout) {
    return null;
  }

  const rows = Array.from({ length: layout.rows }, (_, rowIndex) => {
    const rowLabel = String.fromCharCode(65 + rowIndex);
    const seats = Array.from({ length: layout.columns }, (_, colIndex) => {
      const seatId = `${rowLabel}${colIndex + 1}`;
      const isAvailable = availableSet.has(seatId);
      const isSelected = selectedSet.has(seatId);
      const status = isAvailable ? (isSelected ? 'selected' : 'available') : 'unavailable';

      const handleClick = () => {
        if (!isAvailable) return;
        onToggle(seatId);
      };

      return (
        <button
          key={seatId}
          type="button"
          onClick={handleClick}
          className={`seat ${status}`}
          aria-pressed={isSelected}
          aria-label={`Seat ${seatId} ${status}`}
        >
          {seatId}
        </button>
      );
    });

    return (
      <div key={rowLabel} className="seat-row">
        <span className="seat-row-label">{rowLabel}</span>
        <div className="seat-row-grid">{seats}</div>
      </div>
    );
  });

  return (
    <div className="seat-map">
      <div className="screen-indicator">Screen</div>
      <div className="seat-grid">{rows}</div>
      <div className="seat-legend">
        <div className="legend-item available">Available</div>
        <div className="legend-item selected">Selected</div>
        <div className="legend-item unavailable">Booked</div>
      </div>
    </div>
  );
};

export default SeatMap;
