// Pure cart logic (no React) - used by CartContext and by the tests.
export const initialCart = { items: [] };
const MAX_QTY = 50;

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { id, name, price, imageUrl } = action.item;
      const found = state.items.find((i) => i.id === id);
      if (found) {
        return { items: state.items.map((i) => (i.id === id ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QTY) } : i)) };
      }
      return { items: [...state.items, { id, name, price: Number(price), imageUrl, quantity: 1 }] };
    }
    case 'INCREASE':
      return { items: state.items.map((i) => (i.id === action.id ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QTY) } : i)) };
    case 'DECREASE':
      return {
        items: state.items.map((i) => (i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i)).filter((i) => i.quantity > 0),
      };
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.id) };
    case 'CLEAR':
      return initialCart;
    default:
      return state;
  }
}

export const cartTotal = (items) => Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;
export const cartCount = (items) => items.reduce((sum, i) => sum + i.quantity, 0);
