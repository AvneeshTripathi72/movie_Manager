const db = require('../config/db');
const generateBookingId = require('../utils/generateBookingId');

exports.createBooking = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { show_id, seats } = req.body;
    const user_id = req.user.id;

    if (!show_id || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide show_id and seats array' 
      });
    }

    await connection.beginTransaction();

    const [shows] = await connection.query(
      'SELECT * FROM shows WHERE id = ? FOR UPDATE',
      [show_id]
    );

    if (shows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Show not found' 
      });
    }

    const show = shows[0];

    if (show.available_seats < seats.length) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: `Only ${show.available_seats} seats available` 
      });
    }

    const showDateTime = new Date(`${show.show_date} ${show.show_time}`);
    if (showDateTime < new Date()) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot book seats for past shows' 
      });
    }

    const [existingBookings] = await connection.query(
      'SELECT seats FROM bookings WHERE show_id = ? AND status = ?',
      [show_id, 'confirmed']
    );

    const bookedSeats = new Set();
    existingBookings.forEach(booking => {
      const seatArray = JSON.parse(booking.seats);
      seatArray.forEach(seat => bookedSeats.add(seat));
    });

    const conflictingSeats = seats.filter(seat => bookedSeats.has(seat));
    if (conflictingSeats.length > 0) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: `Seats already booked: ${conflictingSeats.join(', ')}` 
      });
    }

    const total_price = show.price * seats.length;

    const booking_id = generateBookingId();

    const [result] = await connection.query(
      'INSERT INTO bookings (booking_id, user_id, show_id, seats, total_price, status) VALUES (?, ?, ?, ?, ?, ?)',
      [booking_id, user_id, show_id, JSON.stringify(seats), total_price, 'confirmed']
    );

    await connection.query(
      'UPDATE shows SET available_seats = available_seats - ? WHERE id = ?',
      [seats.length, show_id]
    );

    await connection.commit();

    const [bookings] = await db.query(
      `SELECT b.*, s.show_date, s.show_time, s.price, m.title as movie_title, m.poster_url
       FROM bookings b
       JOIN shows s ON b.show_id = s.id
       JOIN movies m ON s.movie_id = m.id
       WHERE b.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: bookings[0]
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating booking' 
    });
  } finally {
    connection.release();
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [bookings] = await db.query(
      `SELECT b.*, s.show_date, s.show_time, s.price, m.title as movie_title, m.poster_url, m.duration, m.language
       FROM bookings b
       JOIN shows s ON b.show_id = s.id
       JOIN movies m ON s.movie_id = m.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [user_id]
    );

    const parsedBookings = bookings.map(booking => ({
      ...booking,
      seats: JSON.parse(booking.seats)
    }));

    res.status(200).json({
      success: true,
      count: parsedBookings.length,
      data: parsedBookings
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching bookings' 
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(
      `SELECT b.*, u.name as user_name, u.email as user_email, 
              s.show_date, s.show_time, s.price, 
              m.title as movie_title, m.poster_url
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN shows s ON b.show_id = s.id
       JOIN movies m ON s.movie_id = m.id
       ORDER BY b.created_at DESC`
    );

    const parsedBookings = bookings.map(booking => ({
      ...booking,
      seats: JSON.parse(booking.seats)
    }));

    res.status(200).json({
      success: true,
      count: parsedBookings.length,
      data: parsedBookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching bookings' 
    });
  }
};
