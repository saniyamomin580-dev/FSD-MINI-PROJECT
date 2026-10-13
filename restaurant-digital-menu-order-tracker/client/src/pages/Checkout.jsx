import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, errorMessage } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import CartPanel from '../components/CartPanel.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

export default function Checkout() {
  const { items, dispatch } = useCart();
  const { showToast } = useToast();
  const nameRef = useRef(null);
  const [form, setForm] = useState({ customerName: '', tableNumber: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(null);

  useEffect(() => nameRef.current?.focus(), []);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (form.customerName.trim().length < 2) e.customerName = 'Please enter your name (at least 2 characters).';
    const table = Number(form.tableNumber);
    if (!Number.isInteger(table) || table < 1 || table > 100) e.tableNumber = 'Enter a table number between 1 and 100.';
    if (items.length === 0) e.items = 'Your cart is empty.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Only ids and quantities are sent - the server calculates prices and the total.
      const res = await api.post('/orders', {
        customerName: form.customerName.trim(),
        tableNumber: Number(form.tableNumber),
        notes: form.notes.trim(),
        items: items.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
      });
      setPlaced(res.data.data);
      dispatch({ type: 'CLEAR' });
      showToast(`Order #${res.data.data.id} placed!`);
    } catch (err) {
      setServerError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (placed) {
    return (
      <div className="card center confirmation">
        <div className="big-emoji">✅</div>
        <h2>Thank you, {placed.customerName}!</h2>
        <p>Your order has been placed.</p>
        <p className="order-id">Order ID: <strong>#{placed.id}</strong></p>
        <p className="muted">Total to pay at the table: ₹{Number(placed.totalAmount).toFixed(2)}</p>
        <Link to={`/track/${placed.id}`} className="btn">Track my order</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>
      {items.length === 0 && (
        <div className="card center">
          <p>Your cart is empty.</p>
          <Link to="/menu" className="btn">Browse the menu</Link>
        </div>
      )}
      {items.length > 0 && (
        <div className="menu-layout">
          <form className="card form" onSubmit={submit} noValidate>
            <h3>Your details</h3>
            <label>Customer name
              <input ref={nameRef} className="input" name="customerName" value={form.customerName} onChange={change} />
              {errors.customerName && <small className="field-error">{errors.customerName}</small>}
            </label>
            <label>Table number
              <input className="input" name="tableNumber" type="number" min="1" max="100" value={form.tableNumber} onChange={change} />
              {errors.tableNumber && <small className="field-error">{errors.tableNumber}</small>}
            </label>
            <label>Order notes (optional)
              <textarea className="input" name="notes" rows="3" maxLength="255" value={form.notes} onChange={change} />
            </label>
            {errors.items && <small className="field-error">{errors.items}</small>}
            <ErrorBox message={serverError} />
            <button className="btn btn-block" type="submit" disabled={submitting}>{submitting ? 'Placing order...' : 'Place Order'}</button>
          </form>
          <CartPanel showCheckoutButton={false} />
        </div>
      )}
    </div>
  );
}
