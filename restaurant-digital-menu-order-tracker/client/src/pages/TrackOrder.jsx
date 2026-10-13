import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, errorMessage } from '../api/client.js';
import OrderDetails from '../components/OrderDetails.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

export default function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(id || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      setOrder(null);
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load automatically when the URL contains an order id (/track/5).
  useEffect(() => {
    if (id) {
      setInput(id);
      loadOrder(id);
    } else {
      setOrder(null);
    }
  }, [id, loadOrder]);

  const submit = (e) => {
    e.preventDefault();
    if (!/^\d+$/.test(input.trim())) return setError('Please enter a valid numeric order ID.');
    if (input.trim() === id) loadOrder(id);
    else navigate(`/track/${input.trim()}`);
  };

  return (
    <div className="narrow">
      <h1>Track your order</h1>
      <form className="inline-form" onSubmit={submit}>
        <input className="input" placeholder="Enter order ID, e.g. 1" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="btn" type="submit">Track</button>
      </form>
      <ErrorBox message={error} />
      {loading && <Loader text="Fetching order..." />}
      {order && !loading && (
        <div className="card">
          <OrderDetails order={order} />
          <button className="btn btn-outline" onClick={() => loadOrder(order.id)}>🔄 Refresh status</button>
        </div>
      )}
    </div>
  );
}
