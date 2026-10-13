import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatCurrency } from '../utils/format.js';

export default function CartPanel({ showCheckoutButton = true }) {
  const { items, total, dispatch } = useCart();

  return (
    <aside className="card cart-panel">
      <h3>Your Order</h3>
      {items.length === 0 ? (
        <p className="muted">Your cart is empty. Add something tasty!</p>
      ) : (
        <ul className="cart-list">
          {items.map((i) => (
            <li key={i.id} className="cart-row">
              <div className="cart-name">
                <strong>{i.name}</strong>
                <span className="muted">{formatCurrency(i.price)} each</span>
              </div>
              <div className="qty">
                <button aria-label={`Decrease ${i.name}`} onClick={() => dispatch({ type: 'DECREASE', id: i.id })}>−</button>
                <span>{i.quantity}</span>
                <button aria-label={`Increase ${i.name}`} onClick={() => dispatch({ type: 'INCREASE', id: i.id })}>+</button>
              </div>
              <div className="cart-line">{formatCurrency(i.price * i.quantity)}</div>
              <button className="icon-btn" aria-label={`Remove ${i.name}`} onClick={() => dispatch({ type: 'REMOVE', id: i.id })}>✕</button>
            </li>
          ))}
        </ul>
      )}
      <div className="cart-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
      {showCheckoutButton && items.length > 0 && <Link to="/checkout" className="btn btn-block">Proceed to Checkout</Link>}
    </aside>
  );
}
