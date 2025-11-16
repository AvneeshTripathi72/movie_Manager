const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/database');
const User = require('../src/models/User');
const Movie = require('../src/models/Movie');
const Theatre = require('../src/models/Theatre');
const Screen = require('../src/models/Screen');
const Show = require('../src/models/Show');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Screen.deleteMany({});
    await Show.deleteMany({});

    console.log('✓ Database cleared');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
      },
    ]);

    console.log('✓ Users created');

    // Create movies
    const movies = await Movie.insertMany([
      {
        title: 'Inception',
        description: 'A sci-fi thriller about dreams and reality',
        genre: ['Sci-Fi', 'Thriller'],
        duration: 148,
        releaseDate: new Date('2010-07-16'),
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Marion Cotillard'],
        language: ['English'],
        rating: 8.8,
        posterUrl: 'https://example.com/inception.jpg',
      },
      {
        title: 'The Dark Knight',
        description: 'A dark superhero film',
        genre: ['Action', 'Crime'],
        duration: 152,
        releaseDate: new Date('2008-07-18'),
        director: 'Christopher Nolan',
        cast: ['Christian Bale', 'Heath Ledger'],
        language: ['English'],
        rating: 9.0,
        posterUrl: 'https://example.com/dark-knight.jpg',
      },
    ]);

    console.log('✓ Movies created');

    // Create theatres
    const theatres = await Theatre.insertMany([
      {
        name: 'PVR Cinemas',
        city: 'Mumbai',
        address: '123 Main Street',
        phone: '+91-9876543210',
        email: 'pvr@example.com',
        amenities: ['Air Conditioning', 'Wheelchair Accessible'],
        isParkingAvailable: true,
        isFood: true,
      },
      {
        name: 'INOX',
        city: 'Delhi',
        address: '456 Park Avenue',
        phone: '+91-9876543211',
        email: 'inox@example.com',
        amenities: ['Premium Seating'],
        isParkingAvailable: true,
        isFood: true,
      },
    ]);

    console.log('✓ Theatres created');

    // Create screens
    const screens = await Screen.insertMany([
      {
        screenNumber: 1,
        theatreId: theatres[0]._id,
        capacity: 240,
        layout: { rows: 20, columns: 12 },
        facilities: ['Dolby Atmos', '4K Projection'],
      },
      {
        screenNumber: 2,
        theatreId: theatres[0]._id,
        capacity: 180,
        layout: { rows: 15, columns: 12 },
        facilities: ['Dolby Surround'],
      },
    ]);

    console.log('✓ Screens created');

    // Create shows
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const shows = await Show.insertMany([
      {
        movieId: movies[0]._id,
        theatreId: theatres[0]._id,
        screenId: screens[0]._id,
        dateTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
        format: '3D',
        language: 'English',
        seatPrice: 250,
        totalSeats: 240,
        bookedSeats: [],
        availableSeats: 240,
      },
      {
        movieId: movies[1]._id,
        theatreId: theatres[1]._id,
        screenId: screens[1]._id,
        dateTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
        format: '2D',
        language: 'English',
        seatPrice: 200,
        totalSeats: 180,
        bookedSeats: [],
        availableSeats: 180,
      },
    ]);

    console.log('✓ Shows created');

    console.log('\n✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('✗ Error seeding database:', err.message);
    process.exit(1);
  }
};

seedDatabase();
