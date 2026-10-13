import StatusBadge from './StatusBadge.jsx';
import { formatCurrency, formatDateTime } from '../utils/format.js';

export default function OrderDetails({ order }) {
  return (
    <div className="order-details">
      <div className="order-head">
        <h2>Order #{order.id}</h2>
        <StatusBadge status={order.status} />
      </div>
      <div className="grid-2 muted-box">
        <div><span className="muted">Customer</span><br /><strong>{order.customerName}</strong></div>
        <div><span className="muted">Table</span><br /><strong>{order.tableNumber}</strong></div>
        <div><span className="muted">Placed on</span><br /><strong>{formatDateTime(order.createdAt)}</strong></div>
        <div><span className="muted">Notes</span><br /><strong>{order.notes || '—'}</strong></div>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
          <tbody>
            {order.items.map((i) => (
              <tr key={i.id}>
                <td>{i.menuItem ? i.menuItem.name : `Item #${i.menuItemId}`}</td>
                <td>{i.quantity}</td>
                <td>{formatCurrency(i.unitPrice)}</td>
                <td>{formatCurrency(i.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td colSpan="3"><strong>Total</strong></td><td><strong>{formatCurrency(order.totalAmount)}</strong></td></tr></tfoot>
        </table>
      </div>
    </div>
  );
}
