const db = require('../config/db');

exports.createShow = async (req, res) => {
  try {
    const { movie_id, show_date, show_time, price, total_seats } = req.body;

    if (!movie_id || !show_date || !show_time || !price) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide movie_id, show_date, show_time, and price' 
      });
    }

    const [movies] = await db.query(
      'SELECT id FROM movies WHERE id = ?',
      [movie_id]
    );

    if (movies.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    const seats = total_seats || 100;

    const [result] = await db.query(
      'INSERT INTO shows (movie_id, show_date, show_time, price, total_seats, available_seats) VALUES (?, ?, ?, ?, ?, ?)',
      [movie_id, show_date, show_time, price, seats, seats]
    );

    const [shows] = await db.query(
      `SELECT s.*, m.title as movie_title, m.poster_url 
       FROM shows s 
       JOIN movies m ON s.movie_id = m.id 
       WHERE s.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Show created successfully',
      data: shows[0]
    });
  } catch (error) {
    console.error('Create show error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating show' 
    });
  }
};

exports.getShowsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const [shows] = await db.query(
      `SELECT s.*, m.title as movie_title, m.poster_url 
       FROM shows s 
       JOIN movies m ON s.movie_id = m.id 
       WHERE s.movie_id = ? AND s.show_date >= CURDATE()
       ORDER BY s.show_date, s.show_time`,
      [movieId]
    );

    res.status(200).json({
      success: true,
      count: shows.length,
      data: shows
    });
  } catch (error) {
    console.error('Get shows error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching shows' 
    });
  }
};

exports.getAllShows = async (req, res) => {
  try {
    const [shows] = await db.query(
      `SELECT s.*, m.title as movie_title, m.poster_url 
       FROM shows s 
       JOIN movies m ON s.movie_id = m.id 
       ORDER BY s.show_date DESC, s.show_time DESC`
    );

    res.status(200).json({
      success: true,
      count: shows.length,
      data: shows
    });
  } catch (error) {
    console.error('Get all shows error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching shows' 
    });
  }
};

exports.getShowById = async (req, res) => {
  try {
    const { id } = req.params;

    const [shows] = await db.query(
      `SELECT s.*, m.title as movie_title, m.poster_url, m.description, m.duration, m.language
       FROM shows s 
       JOIN movies m ON s.movie_id = m.id 
       WHERE s.id = ?`,
      [id]
    );

    if (shows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Show not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: shows[0]
    });
  } catch (error) {
    console.error('Get show error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching show' 
    });
  }
};
