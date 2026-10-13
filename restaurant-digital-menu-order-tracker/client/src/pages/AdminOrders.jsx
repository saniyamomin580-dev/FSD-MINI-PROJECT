import { useState } from 'react';
import { api, errorMessage } from '../api/client.js';
import useFetch from '../hooks/useFetch.js';
import useDebounce from '../hooks/useDebounce.js';
import { useToast } from '../context/ToastContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import OrderDetails from '../components/OrderDetails.jsx';
import Modal from '../components/Modal.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';
import { STATUSES, formatCurrency, formatDateTime } from '../utils/format.js';

export default function AdminOrders() {
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [q, setQ] = useState('');
  const debouncedQ = useDebounce(q);
  const { showToast } = useToast();
  const orders = useFetch('/orders', { status, date, q: debouncedQ });
  const [selected, setSelected] = useState(null);
  const [detailError, setDetailError] = useState('');

  const openOrder = async (id) => {
    setDetailError('');
    try {
      const res = await api.get(`/orders/${id}`);
      setSelected(res.data);
    } catch (err) {
      showToast(errorMessage(err), 'error');
    }
  };

  const changeStatus = async (newStatus) => {
    setDetailError('');
    try {
      const res = await api.patch(`/orders/${selected.id}/status`, { status: newStatus });
      setSelected({ ...selected, status: res.data.data.status });
      showToast(res.data.message);
      orders.reload();
    } catch (err) {
      setDetailError(errorMessage(err));
    }
  };

  return (
    <div className="card">
      <div className="filters">
        <input className="input" placeholder="Search name or order ID" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button className="btn btn-outline" onClick={() => { setQ(''); setStatus(''); setDate(''); }}>Clear</button>
      </div>
      {orders.loading && <Loader />}
      <ErrorBox message={orders.error} onRetry={orders.reload} />
      {orders.data && (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>ID</th><th>Customer</th><th>Table</th><th>Total</th><th>Status</th><th>Placed</th><th /></tr></thead>
            <tbody>
              {orders.data.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td><td>{o.customerName}</td><td>{o.tableNumber}</td><td>{formatCurrency(o.totalAmount)}</td>
                  <td><StatusBadge status={o.status} /></td><td>{formatDateTime(o.createdAt)}</td>
                  <td><button className="btn btn-small" onClick={() => openOrder(o.id)}>View</button></td>
                </tr>
              ))}
              {orders.data.length === 0 && <tr><td colSpan="7" className="muted">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {selected && (
        <Modal title="Order details" onClose={() => setSelected(null)}>
          <OrderDetails order={selected} />
          <div className="status-actions">
            <strong>Update status:</strong>
            {STATUSES.map((s) => (
              <button key={s} className={`btn btn-small ${s === selected.status ? '' : 'btn-outline'}`} disabled={s === selected.status} onClick={() => changeStatus(s)}>{s}</button>
            ))}
          </div>
          <ErrorBox message={detailError} />
        </Modal>
      )}
    </div>
  );
}
