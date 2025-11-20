import React from 'react';

const SeatGrid = ({ totalSeats, bookedSeats, selectedSeats, onSeatClick }) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 10;
  
  const numRows = Math.ceil(totalSeats / seatsPerRow);
  const activeRows = rows.slice(0, numRows);

  const getSeatNumber = (row, seatNum) => `${row}${seatNum}`;

  const getSeatClass = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) {
      return 'seat seat-booked';
    }
    if (selectedSeats.includes(seatNumber)) {
      return 'seat seat-selected';
    }
    return 'seat seat-available';
  };

  const handleSeatClick = (seatNumber) => {
    if (!bookedSeats.includes(seatNumber)) {
      onSeatClick(seatNumber);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="h-2 bg-gradient-to-r from-transparent via-primary-500 to-transparent rounded-full mb-2"></div>
        <p className="text-center text-gray-400 text-sm">Screen this way</p>
      </div>

      <div className="flex flex-col items-center space-y-2">
        {activeRows.map((row) => (
          <div key={row} className="flex items-center space-x-2">
            <span className="w-6 text-gray-400 font-semibold text-sm">{row}</span>
            <div className="flex space-x-2">
              {[...Array(seatsPerRow)].map((_, index) => {
                const seatNum = index + 1;
                const seatNumber = getSeatNumber(row, seatNum);
                const rowIndex = rows.indexOf(row);
                const totalSeatIndex = rowIndex * seatsPerRow + seatNum;
                
                if (totalSeatIndex > totalSeats) {
                  return <div key={seatNum} className="w-10 h-10"></div>;
                }

                return (
                  <button
                    key={seatNum}
                    className={getSeatClass(seatNumber)}
                    onClick={() => handleSeatClick(seatNumber)}
                    disabled={bookedSeats.includes(seatNumber)}
                    title={seatNumber}
                  >
                    {seatNum}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center space-x-6 mt-8 pt-6 border-t border-dark-700">
        <div className="flex items-center space-x-2">
          <div className="seat seat-available w-8 h-8"></div>
          <span className="text-sm text-gray-400">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="seat seat-selected w-8 h-8"></div>
          <span className="text-sm text-gray-400">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="seat seat-booked w-8 h-8"></div>
          <span className="text-sm text-gray-400">Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
