import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// User Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManageMovies from './pages/admin/ManageMovies';
import ManageShows from './pages/admin/ManageShows';
import ViewBookings from './pages/admin/ViewBookings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-dark-900">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/movie/:id" element={<MovieDetails />} />

            {/* Protected User Routes */}
            <Route
              path="/seat-selection/:showId"
              element={
                <PrivateRoute>
                  <SeatSelection />
                </PrivateRoute>
              }
            />
            <Route
              path="/booking-confirmation"
              element={
                <PrivateRoute>
                  <BookingConfirmation />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly={true}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/movies"
              element={
                <PrivateRoute adminOnly={true}>
                  <ManageMovies />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/shows"
              element={
                <PrivateRoute adminOnly={true}>
                  <ManageShows />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <PrivateRoute adminOnly={true}>
                  <ViewBookings />
                </PrivateRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
