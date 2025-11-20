const db = require('../config/db');

exports.getAllMovies = async (req, res) => {
  try {
    const [movies] = await db.query(
      'SELECT * FROM movies ORDER BY release_date DESC'
    );

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching movies' 
    });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const [movies] = await db.query(
      'SELECT * FROM movies WHERE id = ?',
      [id]
    );

    if (movies.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: movies[0]
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching movie' 
    });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const { title, description, duration, language, poster_url, release_date } = req.body;

    if (!title || !duration || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide title, duration, and language' 
      });
    }

    const [result] = await db.query(
      'INSERT INTO movies (title, description, duration, language, poster_url, release_date) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description || null, duration, language, poster_url || null, release_date || null]
    );

    const [movies] = await db.query(
      'SELECT * FROM movies WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movies[0]
    });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating movie' 
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, language, poster_url, release_date } = req.body;

    const [existingMovies] = await db.query(
      'SELECT id FROM movies WHERE id = ?',
      [id]
    );

    if (existingMovies.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    await db.query(
      'UPDATE movies SET title = ?, description = ?, duration = ?, language = ?, poster_url = ?, release_date = ? WHERE id = ?',
      [title, description, duration, language, poster_url, release_date, id]
    );

    const [movies] = await db.query(
      'SELECT * FROM movies WHERE id = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: movies[0]
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating movie' 
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingMovies] = await db.query(
      'SELECT id FROM movies WHERE id = ?',
      [id]
    );

    if (existingMovies.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    await db.query('DELETE FROM movies WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting movie' 
    });
  }
};
