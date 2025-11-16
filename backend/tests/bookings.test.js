const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Booking = require('../src/models/Booking');
const Show = require('../src/models/Show');
const Movie = require('../src/models/Movie');
const Theatre = require('../src/models/Theatre');
const Screen = require('../src/models/Screen');
const { generateToken } = require('../src/utils/helpers');

describe('Bookings API', () => {
  let userId;
  let userToken;
  let showId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/movie_booking_test');
    userId = new mongoose.Types.ObjectId();
    const { accessToken } = generateToken(userId, 'user');
    userToken = accessToken;

    // Create test data
    const movie = await Movie.create({
      title: 'Booking Test Movie',
      description: 'Test',
      genre: ['Action'],
      duration: 120,
      releaseDate: new Date(),
      director: 'Director',
      language: ['English'],
    });

    const theatre = await Theatre.create({
      name: 'Test Theatre',
      city: 'Test City',
      address: 'Test Address',
      phone: '9876543210',
      email: 'test@example.com',
    });

    const screen = await Screen.create({
      screenNumber: 1,
      theatreId: theatre._id,
      capacity: 100,
      layout: { rows: 10, columns: 10 },
    });

    const show = await Show.create({
      movieId: movie._id,
      theatreId: theatre._id,
      screenId: screen._id,
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      format: '2D',
      language: 'English',
      seatPrice: 250,
      totalSeats: 100,
      bookedSeats: [],
      availableSeats: 100,
    });

    showId = show._id;
  });

  afterAll(async () => {
    await Booking.deleteMany({});
    await Show.deleteMany({});
    await Screen.deleteMany({});
    await Theatre.deleteMany({});
    await Movie.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/bookings/reserve', () => {
    it('should reserve seats', async () => {
      const res = await request(app)
        .post('/api/bookings/reserve')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          showId,
          seats: ['A1', 'A2', 'A3'],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('pending');
    });

    it('should not reserve without authentication', async () => {
      const res = await request(app)
        .post('/api/bookings/reserve')
        .send({
          showId,
          seats: ['B1', 'B2'],
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings', () => {
    it('should get user bookings', async () => {
      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.bookings)).toBe(true);
    });

    it('should not get bookings without authentication', async () => {
      const res = await request(app).get('/api/bookings');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
