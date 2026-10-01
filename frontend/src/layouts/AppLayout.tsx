import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'teacher';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">CampusLedger</div>
          <div className="brand-sub">Student Management System</div>
        </div>

        <nav className="nav-links">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          {canManage && <NavLink to="/students">Students</NavLink>}
          <NavLink to="/courses">Courses</NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>
          <button className="btn btn-ghost" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.25)' }} onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
