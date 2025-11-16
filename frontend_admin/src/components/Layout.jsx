import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Movie Manager</h1>
          <p>Admin Panel</p>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/movies">Movies</NavLink>
          <NavLink to="/bookings">Bookings</NavLink>
          <NavLink to="/activity">Activity Logs</NavLink>
        </nav>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-info">
            <h2>{user?.name || 'Admin'}</h2>
            <p>{user?.email}</p>
          </div>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
