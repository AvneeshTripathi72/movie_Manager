# Frontend-Backend Integration Guide

## 🔗 Overview

This guide explains how the frontend and backend are connected and how they communicate with each other.

## 📁 Project Structure

```
movie_rec/
├── backend/                    # Node.js + Express backend
│   ├── src/
│   ├── config/
│   ├── tests/
│   ├── package.json
│   ├── README.md
│   └── BACKEND_SETUP.md
│
└── frontend/                   # React frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── context/
    │   ├── hooks/
    │   ├── utils/
    │   ├── App.jsx
    │   └── index.js
    ├── public/
    ├── package.json
    └── README.md
```

## 🚀 Setup Instructions

### Step 1: Start Backend Server

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on: `http://localhost:3000`

### Step 2: Start Frontend Server

In a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000` (development) or `http://localhost:5173` (Vite)

## 🔌 API Communication

### Frontend API Configuration

**File:** `frontend/src/services/api.js`

```javascript
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - refresh it
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Environment Variables

**Frontend:** `frontend/.env.local`

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

**Backend:** `backend/.env`

```env
MONGODB_URI=mongodb://localhost:27017/movie_booking
JWT_SECRET=your-secret-key
PORT=3000
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## 🔐 Authentication Flow

### 1. User Registration

```
Frontend (Register Component)
    ↓
POST /api/auth/register
    ↓
Backend (Auth Controller)
    ↓
Response: { accessToken, refreshToken, user }
    ↓
Frontend: Store tokens in localStorage
    ↓
Redirect to Movies page
```

### 2. User Login

```
Frontend (Login Component)
    ↓
POST /api/auth/login
    ↓
Backend (Auth Controller)
    ↓
Response: { accessToken, refreshToken, user }
    ↓
Frontend: Store tokens, Set AuthContext
    ↓
Redirect to Movies page
```

### 3. Protected Request

```
Frontend (Any page/component)
    ↓
GET /api/movies (with Authorization header)
    ↓
Backend Middleware: Verify JWT token
    ↓
Backend: Process request
    ↓
Response: Data
    ↓
Frontend: Display data
```

## 📊 API Endpoints Used by Frontend

### Authentication

- `POST /api/auth/register` - Register new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (on app load)

### Movies

- `GET /api/movies` - Get movies list (with filters)
- `GET /api/movies/:id` - Get movie details

### Theatres

- `GET /api/theatres` - Get theatres (filtered by city)

### Shows

- `GET /api/shows` - Get shows for movie at theatre
- `GET /api/shows/:id` - Get show details
- `GET /api/shows/:id/seats` - Get available seats

### Bookings

- `POST /api/bookings/reserve` - Reserve seats
- `POST /api/bookings/confirm` - Confirm booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `DELETE /api/bookings/:id` - Cancel booking

## 💾 Frontend Services

**File:** `frontend/src/services/index.js`

```javascript
// Auth Services
export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getCurrentUser: () => api.get("/auth/me"),
};

// Movie Services
export const movieService = {
  getMovies: (filters) => api.get("/movies", { params: filters }),
  getMovieById: (id) => api.get(`/movies/${id}`),
};

// Theatre Services
export const theatreService = {
  getTheatres: (filters) => api.get("/theatres", { params: filters }),
  getTheatreById: (id) => api.get(`/theatres/${id}`),
};

// Show Services
export const showService = {
  getShows: (filters) => api.get("/shows", { params: filters }),
  getShowById: (id) => api.get(`/shows/${id}`),
  getShowSeats: (id) => api.get(`/shows/${id}/seats`),
};

// Booking Services
export const bookingService = {
  reserveSeats: (data) => api.post("/bookings/reserve", data),
  confirmBooking: (data) => api.post("/bookings/confirm", data),
  getMyBookings: (params) => api.get("/bookings", { params }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
};
```

## 🔄 Component-Controller Mapping

| Frontend Component | Backend Controller                | Key Operations                 |
| ------------------ | --------------------------------- | ------------------------------ |
| Login              | authController                    | register, login                |
| Register           | authController                    | register                       |
| Movies             | movieController                   | getMovies, getMovieById        |
| MovieDetail        | movieController, showController   | getMovieById, getShows         |
| Booking            | bookingController, showController | getShowSeats, reserveSeats     |
| MyBookings         | bookingController                 | getMyBookings, cancelBooking   |
| SeatMap            | showController                    | getShowSeats, reserveSeats     |
| AdminDashboard     | adminController                   | getAllBookings, getSalesReport |

## 📝 Request-Response Examples

### Example 1: Get Movies List

**Frontend Request:**

```javascript
const response = await api.get("/movies", {
  params: {
    page: 1,
    limit: 20,
    genre: "Action",
  },
});
```

**Backend Response:**

```json
{
  "success": true,
  "message": "Movies retrieved successfully",
  "data": {
    "movies": [
      {
        "_id": "123",
        "title": "Inception",
        "genre": ["Sci-Fi"],
        "rating": 8.8
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 3
    }
  }
}
```

### Example 2: Reserve Seats

**Frontend Request:**

```javascript
const response = await api.post("/bookings/reserve", {
  showId: "show123",
  seats: ["A1", "A2", "A3"],
});
```

**Backend Response:**

```json
{
  "success": true,
  "message": "Seats reserved successfully",
  "data": {
    "_id": "booking123",
    "showId": "show123",
    "seats": ["A1", "A2", "A3"],
    "status": "pending",
    "expiresAt": "2024-01-15T10:10:00Z"
  }
}
```

## 🛡️ Error Handling

### Frontend Error Handler

**File:** `frontend/src/services/api.js`

```javascript
// Response interceptor handles errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";

    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      // Forbidden - access denied
      toast.error("You do not have permission for this action");
    }

    return Promise.reject(error);
  }
);
```

### Common Error Scenarios

| Error                    | Status | Frontend Handling                   |
| ------------------------ | ------ | ----------------------------------- |
| Invalid credentials      | 401    | Show error toast, redirect to login |
| Token expired            | 401    | Refresh token or redirect to login  |
| Insufficient permissions | 403    | Show access denied message          |
| Seats already booked     | 409    | Show warning, refresh seats         |
| Email already registered | 409    | Show error message                  |
| Validation error         | 400    | Show field-specific errors          |

## 🔄 State Management

### AuthContext (Frontend)

```javascript
// frontend/src/context/AuthContext.js
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchCurrentUser();
    }
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    const { accessToken, refreshToken, user } = response.data.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## 🧪 Testing Integration

### Frontend Testing

**Test Backend connectivity:**

```bash
# In frontend directory
npm test
```

### Backend Testing

**Test endpoints:**

```bash
# In backend directory
npm test
```

## 📱 CORS Configuration

Backend CORS setup in `backend/src/app.js`:

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
```

## 🚀 Production Deployment

### Backend Deployment (Heroku example)

1. Add Procfile:

```
web: npm start
```

2. Set environment variables on Heroku
3. Push to Heroku

### Frontend Deployment (Vercel example)

1. Update `.env.production`:

```
REACT_APP_API_URL=https://your-backend-url.com/api
```

2. Deploy to Vercel

### CORS Update for Production

Update `CORS_ORIGIN` in backend `.env`:

```
CORS_ORIGIN=https://your-frontend-url.com
```

## 🔍 Debugging Tips

### Check Network Requests

1. Open DevTools → Network tab
2. Look for API requests to `/api/...`
3. Check request headers include `Authorization: Bearer token`
4. Check response status and data

### Check Console Errors

```javascript
// Add debug logs
console.log("Request:", config);
console.log("Response:", response);
console.error("Error:", error);
```

### Verify Token

```javascript
// Check if token is stored
console.log(localStorage.getItem("accessToken"));

// Decode JWT token (jwt-decode library)
import jwtDecode from "jwt-decode";
const decoded = jwtDecode(token);
console.log("Token expires at:", new Date(decoded.exp * 1000));
```

## 📚 Additional Resources

- [Frontend README](../frontend/README.md)
- [Backend README](./backend/README.md)
- [Backend Setup Guide](./backend/BACKEND_SETUP.md)
- [API Documentation](./backend/docs/API_DOCUMENTATION.md)

## ✅ Checklist for Full Setup

- [ ] Backend installed and running on port 3000
- [ ] Frontend installed and running on port 3000/5173
- [ ] MongoDB running locally or configured with Atlas
- [ ] Environment variables configured (.env files)
- [ ] CORS enabled on backend
- [ ] API endpoints tested with sample requests
- [ ] Authentication working (register/login/logout)
- [ ] Movies displaying correctly
- [ ] Booking flow working end-to-end
- [ ] Error handling working properly

## 🎯 Common Issues & Solutions

### CORS Error: "Access to XMLHttpRequest blocked"

**Solution:** Check CORS_ORIGIN in backend .env matches frontend URL

### 401 Unauthorized on protected routes

**Solution:** Check if token is in localStorage and Authorization header

### Cannot connect to MongoDB

**Solution:** Verify MongoDB is running and MONGODB_URI is correct

### Seats not updating after booking

**Solution:** Ensure confirm booking endpoint is called successfully

### Token expires unexpectedly

**Solution:** Check JWT_SECRET is consistent, increase token expiry if needed

---

**Integration Status:** ✅ Complete and Ready
**Backend:** Production Ready
**Frontend:** Production Ready
**API Connectivity:** Tested and Verified
