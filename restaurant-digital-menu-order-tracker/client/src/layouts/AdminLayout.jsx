import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const cls = ({ isActive }) => (isActive ? 'tab active' : 'tab');

  return (
    <div>
      <div className="admin-bar">
        <h1>Admin Panel</h1>
        <button className="btn btn-outline btn-small" onClick={() => { logout(); navigate('/admin/login'); }}>Log out</button>
      </div>
      <nav className="tabs">
        <NavLink to="/admin" end className={cls}>Dashboard</NavLink>
        <NavLink to="/admin/orders" className={cls}>Orders</NavLink>
        <NavLink to="/admin/menu" className={cls}>Menu Items</NavLink>
        <NavLink to="/admin/categories" className={cls}>Categories</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
