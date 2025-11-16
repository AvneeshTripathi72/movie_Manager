import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ActivityLogs from './pages/ActivityLogs.jsx';
import Bookings from './pages/Bookings.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';

import MovieManagement from './pages/MovieManagement';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        )}
      >
        <Route index element={<Dashboard />} />
        <Route path="movies" element={<MovieManagement />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="activity" element={<ActivityLogs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
