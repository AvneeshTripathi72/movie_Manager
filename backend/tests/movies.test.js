const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Movie = require('../src/models/Movie');
const { generateToken } = require('../src/utils/helpers');

describe('Movies API', () => {
  let adminToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/movie_booking_test');
    const { accessToken } = generateToken('admin123', 'admin');
    adminToken = accessToken;
  });

  afterAll(async () => {
    await Movie.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/movies', () => {
    beforeEach(async () => {
      await Movie.deleteMany({});
      await Movie.insertMany([
        {
          title: 'Test Movie 1',
          description: 'Test description 1',
          genre: ['Action'],
          duration: 120,
          releaseDate: new Date(),
          director: 'Director 1',
          language: ['English'],
        },
        {
          title: 'Test Movie 2',
          description: 'Test description 2',
          genre: ['Comedy'],
          duration: 100,
          releaseDate: new Date(),
          director: 'Director 2',
          language: ['Hindi'],
        },
      ]);
    });

    it('should get all movies', async () => {
      const res = await request(app).get('/api/movies');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.movies.length).toBe(2);
    });

    it('should get movies with pagination', async () => {
      const res = await request(app).get('/api/movies?page=1&limit=1');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.movies.length).toBe(1);
      expect(res.body.data.pagination.page).toBe(1);
    });

    it('should filter movies by genre', async () => {
      const res = await request(app).get('/api/movies?genre=Action');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.movies.length).toBe(1);
      expect(res.body.data.movies[0].genre).toContain('Action');
    });
  });

  describe('POST /api/movies', () => {
    it('should create a new movie with admin token', async () => {
      const res = await request(app)
        .post('/api/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'New Movie',
          description: 'New movie description',
          genre: ['Thriller'],
          duration: 130,
          releaseDate: new Date(),
          director: 'New Director',
          language: ['English'],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Movie');
    });

    it('should not create movie without admin token', async () => {
      const res = await request(app)
        .post('/api/movies')
        .send({
          title: 'New Movie',
          description: 'New movie description',
          genre: ['Thriller'],
          duration: 130,
          releaseDate: new Date(),
          director: 'New Director',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/movies/:id', () => {
    let movieId;

    beforeEach(async () => {
      await Movie.deleteMany({});
      const movie = await Movie.create({
        title: 'Get Movie Test',
        description: 'Test description',
        genre: ['Drama'],
        duration: 110,
        releaseDate: new Date(),
        director: 'Test Director',
        language: ['English'],
      });
      movieId = movie._id;
    });

    it('should get a movie by id', async () => {
      const res = await request(app).get(`/api/movies/${movieId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Get Movie Test');
    });

    it('should return 404 for non-existent movie', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/movies/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
