-- Movie Booking System Database Schema
-- MySQL Database Setup

-- Create Database
CREATE DATABASE IF NOT EXISTS movie;
USE movie;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS shows;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Movies Table
CREATE TABLE movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    language VARCHAR(50) NOT NULL,
    poster_url VARCHAR(500),
    release_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_release_date (release_date),
    INDEX idx_language (language)
);

-- Shows Table
CREATE TABLE shows (
    id INT PRIMARY KEY AUTO_INCREMENT,
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
);

-- Bookings Table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
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
);

-- Insert Sample Data

-- Sample Admin User (password: admin123)
-- Sample Regular User (password: user123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@moviebooking.com', '$2a$10$rZ8qH8vXGVZQXKJ5YqKqKuYxJxYxJxYxJxYxJxYxJxYxJxYxJxYxJ', 'admin'),
('John Doe', 'john@example.com', '$2a$10$rZ8qH8vXGVZQXKJ5YqKqKuYxJxYxJxYxJxYxJxYxJxYxJxYxJxYxJ', 'user'),
('Jane Smith', 'jane@example.com', '$2a$10$rZ8qH8vXGVZQXKJ5YqKqKuYxJxYxJxYxJxYxJxYxJxYxJxYxJxYxJ', 'user');

-- Sample Movies
INSERT INTO movies (title, description, duration, language, poster_url, release_date) VALUES
('The Matrix Resurrections', 'Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a construct, to truly know himself, Mr. Anderson will have to choose to follow the white rabbit once more.', 148, 'English', 'https://image.tmdb.org/t/p/w500/8c4a8kE7PizaGQQnditMmI1xbRp.jpg', '2021-12-22'),
('Spider-Man: No Way Home', 'Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous.', 148, 'English', 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', '2021-12-17'),
('Dune', 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.', 155, 'English', 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', '2021-10-22'),
('Shang-Chi and the Legend of the Ten Rings', 'Shang-Chi must confront the past he thought he left behind when he is drawn into the web of the mysterious Ten Rings organization.', 132, 'English', 'https://image.tmdb.org/t/p/w500/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg', '2021-09-03'),
('Eternals', 'The Eternals are a team of ancient aliens who have been living on Earth in secret for thousands of years. When an unexpected tragedy forces them out of the shadows, they are forced to reunite against mankind''s most ancient enemy, the Deviants.', 156, 'English', 'https://image.tmdb.org/t/p/w500/6AdXwFTRTAzggD2QUTt5B7JFGKL.jpg', '2021-11-05'),
('RRR', 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.', 187, 'Telugu', 'https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg', '2022-03-25'),
('KGF Chapter 2', 'The blood-soaked land of Kolar Gold Fields (KGF) has a new overlord now - Rocky, whose name strikes fear in the heart of his foes. His allies look up to Rocky as their savior, the government sees him as a threat to law and order.', 168, 'Kannada', 'https://image.tmdb.org/t/p/w500/xYTdZlF2I9XjQWLx3c3YxYYKbsL.jpg', '2022-04-14'),
('Pushpa: The Rise', 'Pushpa Raj is a coolie who rises in the world of red sandalwood smuggling. Along the way, he doesn''t shy from making an enemy or two.', 179, 'Telugu', 'https://image.tmdb.org/t/p/w500/pU4bLxnUEUe57pOjHhx1K7L3gWx.jpg', '2021-12-17');

-- Sample Shows (for next 7 days)
INSERT INTO shows (movie_id, show_date, show_time, price, total_seats, available_seats) VALUES
-- The Matrix Resurrections
(1, CURDATE(), '10:00:00', 250.00, 100, 100),
(1, CURDATE(), '14:00:00', 250.00, 100, 100),
(1, CURDATE(), '18:00:00', 300.00, 100, 100),
(1, CURDATE(), '21:30:00', 300.00, 100, 100),
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', 250.00, 100, 100),
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', 250.00, 100, 100),
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:00:00', 300.00, 100, 100),

-- Spider-Man: No Way Home
(2, CURDATE(), '11:00:00', 300.00, 150, 150),
(2, CURDATE(), '15:00:00', 300.00, 150, 150),
(2, CURDATE(), '19:00:00', 350.00, 150, 150),
(2, CURDATE(), '22:00:00', 350.00, 150, 150),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', 300.00, 150, 150),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '15:00:00', 300.00, 150, 150),

-- Dune
(3, CURDATE(), '12:00:00', 280.00, 120, 120),
(3, CURDATE(), '16:00:00', 280.00, 120, 120),
(3, CURDATE(), '20:00:00', 320.00, 120, 120),
(3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '12:00:00', 280.00, 120, 120),

-- Shang-Chi
(4, CURDATE(), '13:00:00', 250.00, 100, 100),
(4, CURDATE(), '17:00:00', 280.00, 100, 100),
(4, CURDATE(), '21:00:00', 280.00, 100, 100),

-- Eternals
(5, CURDATE(), '10:30:00', 250.00, 100, 100),
(5, CURDATE(), '14:30:00', 250.00, 100, 100),
(5, CURDATE(), '18:30:00', 300.00, 100, 100),

-- RRR
(6, CURDATE(), '11:30:00', 300.00, 200, 200),
(6, CURDATE(), '15:30:00', 300.00, 200, 200),
(6, CURDATE(), '19:30:00', 350.00, 200, 200),
(6, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:30:00', 300.00, 200, 200),
(6, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '15:30:00', 300.00, 200, 200),

-- KGF Chapter 2
(7, CURDATE(), '12:30:00', 280.00, 150, 150),
(7, CURDATE(), '16:30:00', 280.00, 150, 150),
(7, CURDATE(), '20:30:00', 320.00, 150, 150),

-- Pushpa
(8, CURDATE(), '13:30:00', 250.00, 120, 120),
(8, CURDATE(), '17:30:00', 280.00, 120, 120),
(8, CURDATE(), '21:30:00', 280.00, 120, 120);

-- Sample Bookings
INSERT INTO bookings (booking_id, user_id, show_id, seats, total_price, status) VALUES
('BK1000000001', 2, 1, JSON_ARRAY('A1', 'A2'), 500.00, 'confirmed'),
('BK1000000002', 3, 8, JSON_ARRAY('B5', 'B6', 'B7'), 900.00, 'confirmed'),
('BK1000000003', 2, 15, JSON_ARRAY('C10'), 280.00, 'confirmed');

-- Update available seats for booked shows
UPDATE shows SET available_seats = available_seats - 2 WHERE id = 1;
UPDATE shows SET available_seats = available_seats - 3 WHERE id = 8;
UPDATE shows SET available_seats = available_seats - 1 WHERE id = 15;

-- Display summary
SELECT 'Database setup completed!' AS Status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_movies FROM movies;
SELECT COUNT(*) AS total_shows FROM shows;
SELECT COUNT(*) AS total_bookings FROM bookings;
