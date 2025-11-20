/**
 * Generate unique booking ID
 * Format: BK + 10 digit number
 * Example: BK1234567890
 */
const generateBookingId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const bookingNumber = (timestamp + random).slice(-10);
  return `BK${bookingNumber}`;
};

module.exports = generateBookingId;
