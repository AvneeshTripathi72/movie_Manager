const pool = require('./db');

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `);
    console.log("📌 Users table ready");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        duration INT NOT NULL COMMENT 'Duration in minutes',
        language VARCHAR(50) NOT NULL,
        poster_url VARCHAR(500),
        release_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_release_date (release_date),
        INDEX idx_language (language)
      )
    `);
    console.log("🎬 Movies table ready");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS shows (
        id INT AUTO_INCREMENT PRIMARY KEY,
        movie_id INT NOT NULL,
        show_date DATE NOT NULL,
        show_time TIME NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        total_seats INT NOT NULL DEFAULT 100,
        available_seats INT NOT NULL DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
        INDEX idx_movie_date (movie_id, show_date),
        INDEX idx_show_date (show_date),
        CONSTRAINT chk_available_seats CHECK (available_seats >= 0 AND available_seats <= total_seats)
      )
    `);
    console.log("🎭 Shows table ready");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id VARCHAR(20) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        show_id INT NOT NULL,
        seats JSON NOT NULL COMMENT 'Array of seat numbers',
        total_price DECIMAL(10, 2) NOT NULL,
        status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_show_id (show_id),
        INDEX idx_booking_id (booking_id),
        INDEX idx_status (status)
      )
    `);
    console.log("🎫 Bookings table ready");

  } catch (err) {
    console.error("❌ Table creation error:", err.message);
  }
}

module.exports = initDB;
