import { useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';
import { formatCurrency, todayISO } from '../utils/format.js';

function StatCard({ label, value, tone }) {
  return (
    <div className={`card stat stat-${tone || 'brown'}`}>
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function AdminDashboard() {
  const [date, setDate] = useState(todayISO());
  const stats = useFetch('/dashboard/stats');
  const report = useFetch('/reports/daily-sales', { date });
  const s = stats.data;
  const r = report.data;

  return (
    <div>
      {stats.loading && <Loader />}
      <ErrorBox message={stats.error} onRetry={stats.reload} />
      {s && (
        <div className="grid-4">
          <StatCard label="Total orders" value={s.totalOrders} />
          <StatCard label="Pending orders" value={s.pendingOrders} tone="terracotta" />
          <StatCard label="Completed orders" value={s.completedOrders} tone="green" />
          <StatCard label="Menu items" value={s.totalMenuItems} />
        </div>
      )}

      <div className="card">
        <div className="between">
          <h3>Daily sales report</h3>
          <input className="input input-auto" type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
        </div>
        {report.loading && <Loader />}
        <ErrorBox message={report.error} onRetry={report.reload} />
        {r && !report.loading && (
          <>
            <div className="grid-3">
              <StatCard label="Orders" value={r.totalOrders} />
              <StatCard label="Total sales" value={formatCurrency(r.totalSales)} tone="green" />
              <StatCard label="Completed" value={r.completedOrders} />
            </div>
            <div className="grid-2">
              <div>
                <h4>Sales by status</h4>
                {r.byStatus.length === 0 ? <p className="muted">No orders on this day.</p> : (
                  <table className="table"><thead><tr><th>Status</th><th>Orders</th><th>Sales</th></tr></thead>
                    <tbody>{r.byStatus.map((x) => <tr key={x.status}><td>{x.status}</td><td>{x.orders}</td><td>{formatCurrency(x.sales)}</td></tr>)}</tbody></table>
                )}
              </div>
              <div>
                <h4>Top items</h4>
                {r.topItems.length === 0 ? <p className="muted">No items sold.</p> : (
                  <table className="table"><thead><tr><th>Item</th><th>Qty</th><th>Revenue</th></tr></thead>
                    <tbody>{r.topItems.map((x) => <tr key={x.name}><td>{x.name}</td><td>{x.quantitySold}</td><td>{formatCurrency(x.revenue)}</td></tr>)}</tbody></table>
                )}
              </div>
            </div>
            <h4>Last 7 days</h4>
            <table className="table"><thead><tr><th>Date</th><th>Orders</th><th>Sales</th></tr></thead>
              <tbody>{r.lastSevenDays.map((x) => <tr key={x.saleDate}><td>{x.saleDate}</td><td>{x.orders}</td><td>{formatCurrency(x.sales)}</td></tr>)}</tbody></table>
          </>
        )}
      </div>
    </div>
  );
}
