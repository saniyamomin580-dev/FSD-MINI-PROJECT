const test = require('node:test');
const assert = require('node:assert/strict');
const { validateOrderInput, findItemProblems, calculateOrder, isValidDateString, round2 } = require('../src/utils/orderUtils');

const menuMap = new Map([
  [1, { id: 1, name: 'Paneer Tikka', price: '220.00', isAvailable: true }],
  [2, { id: 2, name: 'Chai', price: '40.00', isAvailable: true }],
  [3, { id: 3, name: 'Fish Curry', price: '360.00', isAvailable: false }],
]);

test('valid order passes validation and merges duplicate items', () => {
  const { errors, data } = validateOrderInput({
    customerName: ' Rahul ', tableNumber: '4',
    items: [{ menuItemId: 1, quantity: 1 }, { menuItemId: 1, quantity: 2 }],
  });
  assert.equal(errors.length, 0);
  assert.equal(data.customerName, 'Rahul');
  assert.deepEqual(data.items, [{ menuItemId: 1, quantity: 3 }]);
});

test('invalid name, table, empty items are rejected', () => {
  const { errors } = validateOrderInput({ customerName: 'A', tableNumber: 0, items: [] });
  assert.equal(errors.length, 3);
});

test('zero, negative and decimal quantities are rejected', () => {
  for (const quantity of [0, -2, 1.5, 'abc', 51]) {
    const { errors } = validateOrderInput({ customerName: 'Rahul', tableNumber: 1, items: [{ menuItemId: 1, quantity }] });
    assert.equal(errors.length, 1, `quantity ${quantity} should be rejected`);
  }
});

test('unavailable and missing items are reported', () => {
  const problems = findItemProblems([{ menuItemId: 3 }, { menuItemId: 99 }, { menuItemId: 1 }], menuMap);
  assert.equal(problems.length, 2);
});

test('total is calculated from database prices, ignoring client totals', () => {
  const { errors, data } = validateOrderInput({
    customerName: 'Rahul', tableNumber: 4, totalAmount: 1,
    items: [{ menuItemId: 1, quantity: 1, price: 1 }, { menuItemId: 2, quantity: 2 }],
  });
  assert.equal(errors.length, 0);
  const { lines, total } = calculateOrder(data.items, menuMap);
  assert.equal(total, 300);
  assert.equal(lines[0].subtotal, 220);
  assert.equal(lines[1].unitPrice, 40);
});

test('date and rounding helpers', () => {
  assert.equal(isValidDateString('2026-10-12'), true);
  assert.equal(isValidDateString('2026-02-30'), false);
  assert.equal(isValidDateString('12-10-2026'), false);
  assert.equal(round2(0.1 + 0.2), 0.3);
});
