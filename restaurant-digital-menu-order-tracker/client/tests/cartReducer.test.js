import test from 'node:test';
import assert from 'node:assert/strict';
import { cartReducer, initialCart, cartTotal, cartCount } from '../src/context/cartReducer.js';

const paneer = { id: 1, name: 'Paneer Tikka', price: '220.00', imageUrl: null };
const chai = { id: 10, name: 'Masala Chai', price: 40, imageUrl: null };

test('adding the same item twice increases its quantity', () => {
  let s = cartReducer(initialCart, { type: 'ADD', item: paneer });
  s = cartReducer(s, { type: 'ADD', item: paneer });
  assert.equal(s.items.length, 1);
  assert.equal(s.items[0].quantity, 2);
  assert.equal(s.items[0].price, 220); // string price converted to a number
});

test('total and count are calculated correctly', () => {
  let s = cartReducer(initialCart, { type: 'ADD', item: paneer });
  s = cartReducer(s, { type: 'ADD', item: chai });
  s = cartReducer(s, { type: 'INCREASE', id: 10 });
  assert.equal(cartTotal(s.items), 300);
  assert.equal(cartCount(s.items), 3);
});

test('decreasing to zero removes the item; REMOVE and CLEAR work', () => {
  let s = cartReducer(initialCart, { type: 'ADD', item: chai });
  s = cartReducer(s, { type: 'DECREASE', id: 10 });
  assert.equal(s.items.length, 0);
  s = cartReducer(s, { type: 'ADD', item: paneer });
  s = cartReducer(s, { type: 'REMOVE', id: 1 });
  assert.equal(s.items.length, 0);
  s = cartReducer(s, { type: 'ADD', item: paneer });
  assert.equal(cartReducer(s, { type: 'CLEAR' }).items.length, 0);
});

test('quantity is capped at 50', () => {
  let s = cartReducer(initialCart, { type: 'ADD', item: chai });
  for (let i = 0; i < 80; i++) s = cartReducer(s, { type: 'INCREASE', id: 10 });
  assert.equal(s.items[0].quantity, 50);
});
