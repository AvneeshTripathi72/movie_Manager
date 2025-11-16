# Backend Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

4. **Update `.env` file with your configuration:**
   ```
   MONGODB_URI=mongodb://localhost:27017/movie_booking
   JWT_SECRET=your-secret-key
   PORT=3000
   NODE_ENV=development
   ```

## Running the Backend

### Development Mode (with hot reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Seed Database (Optional)

```bash
npm run seed
```

This will populate the database with sample users, movies, theatres, screens, and shows.

## API Testing

### Health Check

```bash
GET http://localhost:3000/health
```

### Authentication Endpoints

#### Register

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User

```bash
GET http://localhost:3000/api/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## API Endpoints

### Movies

- `GET /api/movies` - Get all movies (with filters)
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create movie (Admin only)
- `PATCH /api/movies/:id` - Update movie (Admin only)
- `DELETE /api/movies/:id` - Delete movie (Admin only)

### Theatres

- `GET /api/theatres` - Get all theatres
- `GET /api/theatres/:id` - Get theatre by ID
- `POST /api/theatres` - Create theatre (Admin only)
- `PATCH /api/theatres/:id` - Update theatre (Admin only)
- `DELETE /api/theatres/:id` - Delete theatre (Admin only)

### Shows

- `GET /api/shows` - Get all shows
- `GET /api/shows/:id` - Get show by ID
- `GET /api/shows/:id/seats` - Get available seats
- `POST /api/shows` - Create show (Admin only)
- `PATCH /api/shows/:id` - Update show (Admin only)
- `DELETE /api/shows/:id` - Delete show (Admin only)

### Bookings

- `POST /api/bookings/reserve` - Reserve seats
- `POST /api/bookings/confirm` - Confirm booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `DELETE /api/bookings/:id` - Cancel booking

### Admin

- `GET /api/admin/bookings` - Get all bookings (Admin only)
- `POST /api/admin/bookings/confirm` - Confirm booking manually (Admin only)
- `POST /api/admin/bookings/cancel` - Cancel booking manually (Admin only)
- `GET /api/admin/reports/sales` - Get sales report (Admin only)
- `GET /api/admin/reports/top-movies` - Get top movies (Admin only)

## Running Tests

```bash
npm test
```

For watch mode:

```bash
npm run test:watch
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
├── config/
│   └── database.js       # MongoDB connection
├── tests/                # Integration tests
├── scripts/
│   └── seed.js           # Database seeding
├── docs/                 # Documentation
├── .env.example          # Environment template
├── .gitignore            # Git ignore file
├── package.json          # Dependencies
└── README.md             # This file
```

## Error Handling

All endpoints return JSON responses with consistent structure:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message",
  "details": []
}
```

## Security Features

- JWT authentication with refresh tokens
- Password hashing using bcryptjs
- Input validation with Joi
- Rate limiting on sensitive endpoints
- CORS configuration
- Helmet security headers
- MongoDB injection prevention

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check MongoDB URI in `.env`
- Verify credentials for MongoDB Atlas

### JWT Token Issues

- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration time
- Use valid token format: `Bearer YOUR_TOKEN`

### Port Already in Use

- Change `PORT` in `.env`
- Or kill process using port 3000

## Next Steps

1. Set up MongoDB database
2. Configure environment variables
3. Install dependencies
4. Run `npm run seed` to populate sample data
5. Start the server with `npm run dev`
6. Test endpoints using Postman or similar tool
7. Connect frontend to this API

## Support

For issues or questions, please refer to the main project documentation.
