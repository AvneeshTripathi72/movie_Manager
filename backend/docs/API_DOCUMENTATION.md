# Backend API Documentation

## Overview

The Movie Booking Backend is a RESTful API built with Express.js and MongoDB. It provides comprehensive endpoints for managing movies, theatres, shows, and bookings.

## Authentication

All protected endpoints require Bearer token authentication:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Tokens are obtained via login and expire after 15 minutes. Use refresh token to obtain new access token.

## Request/Response Format

### Request Headers

```
Content-Type: application/json
Authorization: Bearer token (for protected routes)
```

### Response Format

```json
{
  "success": true/false,
  "message": "Description",
  "data": {}
}
```

## API Endpoints

### Authentication

#### POST /api/auth/register

Register a new user.

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

#### POST /api/auth/login

Login user.

**Request:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

#### GET /api/auth/me

Get current user (Protected).

**Response (200):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Movies

#### GET /api/movies

Get all movies with filters.

**Query Parameters:**

- `genre`: Filter by genre
- `language`: Filter by language
- `search`: Search by title
- `sort`: Sort by field (default: -releaseDate)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)

**Response (200):**

```json
{
  "success": true,
  "message": "Movies retrieved successfully",
  "data": {
    "movies": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 3
    }
  }
}
```

#### GET /api/movies/:id

Get movie by ID.

**Response (200):**

```json
{
  "success": true,
  "message": "Movie retrieved successfully",
  "data": {
    "_id": "movie_id",
    "title": "Inception",
    "description": "A sci-fi thriller",
    "genre": ["Sci-Fi", "Thriller"],
    "duration": 148,
    "releaseDate": "2010-07-16T00:00:00.000Z",
    "director": "Christopher Nolan",
    "cast": ["Leonardo DiCaprio"],
    "language": ["English"],
    "rating": 8.8
  }
}
```

#### POST /api/movies

Create new movie (Admin only).

**Request:**

```json
{
  "title": "New Movie",
  "description": "Movie description",
  "genre": ["Action"],
  "duration": 120,
  "releaseDate": "2024-01-01",
  "director": "Director Name",
  "language": ["English"]
}
```

**Response (201):** Movie object

#### PATCH /api/movies/:id

Update movie (Admin only).

**Request:** Same as POST (partial updates allowed)

**Response (200):** Updated movie object

#### DELETE /api/movies/:id

Delete movie (Admin only).

**Response (200):**

```json
{
  "success": true,
  "message": "Movie deleted successfully",
  "data": { "_id": "movie_id" }
}
```

### Theatres

#### GET /api/theatres

Get all theatres.

**Query Parameters:**

- `city`: Filter by city
- `search`: Search by name
- `page`: Page number
- `limit`: Results per page

**Response (200):**

```json
{
  "success": true,
  "message": "Theatres retrieved successfully",
  "data": {
    "theatres": [...],
    "pagination": { ... }
  }
}
```

#### GET /api/theatres/:id

Get theatre by ID.

**Response (200):**

```json
{
  "success": true,
  "message": "Theatre retrieved successfully",
  "data": {
    "_id": "theatre_id",
    "name": "PVR Cinemas",
    "city": "Mumbai",
    "address": "123 Main Street",
    "phone": "+91-9876543210",
    "screens": [...],
    "isParkingAvailable": true,
    "isFood": true
  }
}
```

#### POST /api/theatres

Create new theatre (Admin only).

**Request:**

```json
{
  "name": "Theatre Name",
  "city": "City Name",
  "address": "Address",
  "phone": "+91-1234567890",
  "email": "theatre@example.com",
  "isParkingAvailable": true,
  "isFood": true
}
```

#### PATCH /api/theatres/:id

Update theatre (Admin only).

#### DELETE /api/theatres/:id

Delete theatre (Admin only).

### Shows

#### GET /api/shows

Get all shows.

**Query Parameters:**

- `movieId`: Filter by movie
- `theatreId`: Filter by theatre
- `date`: Filter by date
- `page`: Page number
- `limit`: Results per page

**Response (200):**

```json
{
  "success": true,
  "message": "Shows retrieved successfully",
  "data": {
    "shows": [
      {
        "_id": "show_id",
        "movieId": { "_id": "movie_id", "title": "Movie Title" },
        "theatreId": { "_id": "theatre_id", "name": "Theatre Name" },
        "dateTime": "2024-01-15T10:00:00.000Z",
        "format": "3D",
        "language": "English",
        "seatPrice": 250,
        "totalSeats": 240,
        "bookedSeats": ["A1", "A2"],
        "availableSeats": 238
      }
    ],
    "pagination": { ... }
  }
}
```

#### GET /api/shows/:id

Get show by ID.

#### GET /api/shows/:id/seats

Get available seats for a show.

**Response (200):**

```json
{
  "success": true,
  "message": "Seats retrieved successfully",
  "data": {
    "seats": ["A1", "A2", "A3", ...],
    "availableCount": 238
  }
}
```

#### POST /api/shows

Create new show (Admin only).

**Request:**

```json
{
  "movieId": "movie_id",
  "theatreId": "theatre_id",
  "screenId": "screen_id",
  "dateTime": "2024-01-15T10:00:00Z",
  "format": "3D",
  "language": "English",
  "seatPrice": 250,
  "totalSeats": 240
}
```

#### PATCH /api/shows/:id

Update show (Admin only).

#### DELETE /api/shows/:id

Delete show (Admin only).

### Bookings

#### POST /api/bookings/reserve

Reserve seats (Protected).

**Request:**

```json
{
  "showId": "show_id",
  "seats": ["A1", "A2", "A3"]
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Seats reserved successfully",
  "data": {
    "_id": "booking_id",
    "showId": "show_id",
    "seats": ["A1", "A2", "A3"],
    "status": "pending",
    "expiresAt": "2024-01-15T10:10:00.000Z"
  }
}
```

#### POST /api/bookings/confirm

Confirm booking (Protected).

**Request:**

```json
{
  "bookingId": "booking_id",
  "email": "user@example.com",
  "phone": "+91-9876543210",
  "paymentMethod": "card"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "data": {
    "_id": "booking_id",
    "status": "confirmed",
    "totalPrice": 750,
    "paymentMethod": "card"
  }
}
```

#### GET /api/bookings

Get user bookings (Protected).

**Query Parameters:**

- `page`: Page number
- `limit`: Results per page

**Response (200):**

```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": {
    "bookings": [...],
    "pagination": { ... }
  }
}
```

#### GET /api/bookings/:id

Get booking by ID (Protected).

#### DELETE /api/bookings/:id

Cancel booking (Protected).

**Response (200):** Updated booking with cancelled status

### Admin

#### GET /api/admin/bookings

Get all bookings (Admin only).

**Query Parameters:**

- `status`: Filter by status (pending, confirmed, cancelled)
- `page`: Page number
- `limit`: Results per page

#### POST /api/admin/bookings/confirm

Manually confirm booking (Admin only).

**Request:**

```json
{
  "bookingId": "booking_id"
}
```

#### POST /api/admin/bookings/cancel

Manually cancel booking (Admin only).

**Request:**

```json
{
  "bookingId": "booking_id"
}
```

#### GET /api/admin/reports/sales

Get sales report (Admin only).

**Response (200):**

```json
{
  "success": true,
  "message": "Sales report retrieved successfully",
  "data": {
    "totalRevenue": 50000,
    "bookingCount": 200,
    "showRevenue": {
      "show_id1": 5000,
      "show_id2": 3000
    }
  }
}
```

#### GET /api/admin/reports/top-movies

Get top movies by revenue (Admin only).

**Response (200):**

```json
{
  "success": true,
  "message": "Top movies retrieved successfully",
  "data": [
    {
      "movieId": "movie_id",
      "title": "Movie Title",
      "bookings": 50,
      "revenue": 12500
    }
  ]
}
```

## HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

## Error Codes

| Code | Message                  | Solution                     |
| ---- | ------------------------ | ---------------------------- |
| 401  | No token provided        | Include Authorization header |
| 401  | Invalid token            | Check token validity         |
| 401  | Token expired            | Refresh token                |
| 403  | Insufficient permissions | Admin access required        |
| 404  | Resource not found       | Check resource ID            |
| 409  | Email already registered | Use different email          |
| 409  | Seats already booked     | Choose different seats       |

## Rate Limiting

- General endpoints: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes

## Best Practices

1. Always include authentication token in header
2. Use pagination for list endpoints
3. Handle errors gracefully
4. Cache frequently accessed data
5. Use HTTPS in production
6. Rotate JWT secret regularly
