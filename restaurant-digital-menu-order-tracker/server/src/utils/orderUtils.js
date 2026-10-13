// Pure helper functions (no database) so they are easy to test.
const ORDER_STATUSES = ['Pending', 'Preparing', 'Ready', 'Completed'];

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function todayString() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// Checks the body of POST /api/orders. Returns { errors, data }.
// Totals sent by the client are ignored on purpose.
function validateOrderInput(body = {}) {
  const errors = [];
  const customerName = String(body.customerName || '').trim();
  const notes = String(body.notes || '').trim();
  const tableNumber = Number(body.tableNumber);

  if (customerName.length < 2 || customerName.length > 80) {
    errors.push('Customer name must be between 2 and 80 characters.');
  }
  if (!Number.isInteger(tableNumber) || tableNumber < 1 || tableNumber > 100) {
    errors.push('Table number must be a whole number between 1 and 100.');
  }
  if (notes.length > 255) errors.push('Notes can be at most 255 characters.');

  const merged = new Map();
  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push('At least one menu item is required.');
  } else {
    body.items.forEach((item, index) => {
      const menuItemId = Number(item && item.menuItemId);
      const quantity = Number(item && item.quantity);
      if (!Number.isInteger(menuItemId) || menuItemId < 1) {
        errors.push(`Item ${index + 1}: menuItemId is invalid.`);
      } else if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
        errors.push(`Item ${index + 1}: quantity must be a whole number from 1 to 50.`);
      } else {
        merged.set(menuItemId, (merged.get(menuItemId) || 0) + quantity);
      }
    });
  }

  const items = [...merged].map(([menuItemId, quantity]) => ({ menuItemId, quantity }));
  return { errors, data: { customerName, tableNumber, notes: notes || null, items } };
}

// menuMap: Map of id -> { id, name, price, isAvailable }
function findItemProblems(items, menuMap) {
  const problems = [];
  items.forEach(({ menuItemId }) => {
    const menuItem = menuMap.get(menuItemId);
    if (!menuItem) problems.push(`Menu item ${menuItemId} does not exist.`);
    else if (!menuItem.isAvailable) problems.push(`"${menuItem.name}" is currently unavailable.`);
  });
  return problems;
}

// Calculates every line and the grand total from DATABASE prices.
function calculateOrder(items, menuMap) {
  const lines = items.map(({ menuItemId, quantity }) => {
    const unitPrice = round2(menuMap.get(menuItemId).price);
    return { menuItemId, quantity, unitPrice, subtotal: round2(unitPrice * quantity) };
  });
  const total = round2(lines.reduce((sum, l) => sum + l.subtotal, 0));
  return { lines, total };
}

module.exports = {
  ORDER_STATUSES,
  round2,
  isValidDateString,
  todayString,
  validateOrderInput,
  findItemProblems,
  calculateOrder,
};
