export const formatCurrency = (n) => `₹${Number(n || 0).toFixed(2)}`;

export const formatDateTime = (value) =>
  new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const STATUSES = ['Pending', 'Preparing', 'Ready', 'Completed'];
