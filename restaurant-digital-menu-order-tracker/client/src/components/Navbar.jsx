import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { count } = useCart();
  const { isAdmin } = useAuth();
  const cls = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">🍽️ Saffron &amp; Salt</Link>
        <nav className="nav-links">
          <NavLink to="/" end className={cls}>Home</NavLink>
          <NavLink to="/menu" className={cls}>Menu</NavLink>
          <NavLink to="/track" className={cls}>Track Order</NavLink>
          <NavLink to="/checkout" className={cls}>
            Cart {count > 0 && <span className="cart-count">{count}</span>}
          </NavLink>
          <NavLink to={isAdmin ? '/admin' : '/admin/login'} className={cls}>Admin</NavLink>
        </nav>
      </div>
    </header>
  );
}
