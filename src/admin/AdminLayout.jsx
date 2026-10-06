import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import './admin.css';

function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="admin">
      <header className="admin__header">
        <span className="admin__brand">WOLFPACK.FM ADMIN</span>

        <nav className="admin__nav" aria-label="Admin">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'admin__nav-link admin__nav-link--active' : 'admin__nav-link')}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/articles" className={({ isActive }) => (isActive ? 'admin__nav-link admin__nav-link--active' : 'admin__nav-link')}>
            Articles
          </NavLink>
          <NavLink to="/admin/artists" className={({ isActive }) => (isActive ? 'admin__nav-link admin__nav-link--active' : 'admin__nav-link')}>
            Artists
          </NavLink>
          <NavLink to="/admin/radio-tracks" className={({ isActive }) => (isActive ? 'admin__nav-link admin__nav-link--active' : 'admin__nav-link')}>
            Radio
          </NavLink>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin__nav-link">
            View Site
          </a>
          <button type="button" className="admin__nav-link admin__logout" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="admin__main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
