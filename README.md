# 🎬 Movie Booking System

A complete, production-ready Movie Booking System built with React (frontend), Express (backend), and MySQL (database). This system supports user authentication, movie browsing, seat selection, booking management, and a comprehensive admin dashboard.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Default Credentials](#default-credentials)
- [Screenshots](#screenshots)

## ✨ Features

### User Features
- 🔐 User registration and login with JWT authentication
- 🎬 Browse movies with search functionality
- 📝 View detailed movie information
- 🎭 Select showtimes and book seats
- 💺 Interactive seat selection with real-time availability
- 🎫 View booking history
- ✅ Booking confirmation with unique booking ID

### Admin Features
- 📊 Admin dashboard with statistics
- ➕ Add, edit, and delete movies
- 🎪 Create and manage showtimes
- 👥 View all bookings and revenue analytics
- 🔒 Role-based access control

### Technical Features
- 🚫 Double-booking prevention using database transactions
- 🔑 JWT-based authentication
- 🎨 Modern, responsive UI with TailwindCSS
- ⚡ Fast and optimized with Vite
- 🛡️ Password hashing with bcrypt
- 📱 Mobile-friendly design

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- **MySQL Workbench** (optional but recommended) - [Download](https://dev.mysql.com/downloads/workbench/)
- **npm** or **yarn** package manager

## 🚀 Installation

### 1. Clone or Navigate to Project Directory

```bash
cd c:\Users\avani\Desktop\movie_rec
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🗄️ Database Setup

### Step 1: Create Database

1. Open MySQL Workbench or MySQL command line
2. Run the SQL script located at `database/database.sql`

**Using MySQL Workbench:**
- Open MySQL Workbench
- Connect to your MySQL server
- File → Open SQL Script → Select `database/database.sql`
- Execute the script (⚡ icon or Ctrl+Shift+Enter)

**Using Command Line:**
```bash
mysql -u root -p < database/database.sql
```

### Step 2: Configure Backend Environment

1. Navigate to the backend folder
2. Open `.env` file
3. Update the following variables with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=movie_booking_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

**Important:** Replace `your_mysql_password` with your actual MySQL password.

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000`

For development with auto-reload:
```bash
npm run dev
```

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## 🌐 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Movie Endpoints

#### Get All Movies
```http
GET /movies
```

#### Get Movie by ID
```http
GET /movies/:id
```

#### Create Movie (Admin Only)
```http
POST /movies
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Movie Title",
  "description": "Movie description",
  "duration": 120,
  "language": "English",
  "poster_url": "https://example.com/poster.jpg",
  "release_date": "2024-01-01"
}
```

#### Update Movie (Admin Only)
```http
PUT /movies/:id
Authorization: Bearer {token}
```

#### Delete Movie (Admin Only)
```http
DELETE /movies/:id
Authorization: Bearer {token}
```

### Show Endpoints

#### Get Shows by Movie
```http
GET /shows/:movieId
```

#### Get Show Details
```http
GET /shows/detail/:id
```

#### Create Show (Admin Only)
```http
POST /shows
Authorization: Bearer {token}
Content-Type: application/json

{
  "movie_id": 1,
  "show_date": "2024-01-15",
  "show_time": "18:00:00",
  "price": 250.00,
  "total_seats": 100
}
```

### Booking Endpoints

#### Create Booking
```http
POST /bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "show_id": 1,
  "seats": ["A1", "A2", "A3"]
}
```

#### Get User Bookings
```http
GET /bookings/my-bookings
Authorization: Bearer {token}
```

#### Get All Bookings (Admin Only)
```http
GET /bookings
Authorization: Bearer {token}
```

## 📁 Project Structure

```
movie_rec/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── movieController.js    # Movie CRUD
│   │   ├── showController.js     # Show management
│   │   └── bookingController.js  # Booking logic
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── admin.js              # Admin check
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── showRoutes.js
│   │   └── bookingRoutes.js
│   ├── utils/
│   │   └── generateBookingId.js
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express app
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── SeatGrid.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── SeatSelection.jsx
│   │   │   ├── BookingConfirmation.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManageMovies.jsx
│   │   │       ├── ManageShows.jsx
│   │   │       └── ViewBookings.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── movieService.js
│   │   │   ├── showService.js
│   │   │   └── bookingService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── database/
    └── database.sql              # Database schema & seed data
```

## 🔑 Default Credentials

### Admin Account
- **Email:** admin@moviebooking.com
- **Password:** admin123

### Test User Accounts
- **Email:** john@example.com
- **Password:** user123

- **Email:** jane@example.com
- **Password:** user123

**Note:** The passwords in the database are hashed. For testing, you'll need to update the hashed passwords in the SQL file or create new accounts through the registration page.

## 🎨 Features Walkthrough

### User Flow
1. **Browse Movies** - View all available movies on the home page
2. **Select Movie** - Click on a movie to view details and available showtimes
3. **Choose Showtime** - Select your preferred date and time
4. **Select Seats** - Interactive seat selection with real-time availability
5. **Confirm Booking** - Review and confirm your booking
6. **View Tickets** - Access your booking history anytime

### Admin Flow
1. **Login as Admin** - Use admin credentials
2. **Dashboard** - View statistics and quick actions
3. **Manage Movies** - Add, edit, or delete movies
4. **Manage Shows** - Create showtimes for movies
5. **View Bookings** - Monitor all bookings and revenue

## 🔧 Troubleshooting

### Backend Issues

**MySQL Connection Error:**
- Verify MySQL is running
- Check credentials in `.env` file
- Ensure database exists

**Port Already in Use:**
- Change PORT in `.env` file
- Kill process using port 5000

### Frontend Issues

**API Connection Error:**
- Ensure backend is running on port 5000
- Check CORS settings in backend

**Build Errors:**
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Support

For issues or questions, please check:
- Backend logs in terminal
- Browser console for frontend errors
- MySQL error logs

## 🚀 Future Enhancements

- Payment gateway integration
- Email notifications
- QR code for tickets
- Movie reviews and ratings
- Advanced seat layouts
- Multiple cinema locations
- Promotional offers and discounts

---

**Built with ❤️ using React, Express, and MySQL**
