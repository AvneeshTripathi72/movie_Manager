import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Booking from './pages/Booking.jsx';
import BookingDetail from './pages/BookingDetail.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import Movies from './pages/Movies.jsx';
import MyBookings from './pages/MyBookings.jsx';
import NotFound from './pages/NotFound.jsx';
import Register from './pages/Register.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="movies" element={<Movies />} />
        <Route path="movies/:movieId" element={<MovieDetail />} />
        <Route
          path="shows/:showId/book"
          element={(
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          )}
        />
        <Route
          path="bookings"
          element={(
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          )}
        />
        <Route
          path="bookings/:bookingId"
          element={(
            <ProtectedRoute>
              <BookingDetail />
            </ProtectedRoute>
          )}
        />
        <Route
          path="admin"
          element={(
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
