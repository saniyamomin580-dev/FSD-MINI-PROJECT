import { createContext, useContext, useMemo, useReducer } from 'react';
import { cartReducer, initialCart, cartTotal, cartCount } from './cartReducer.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);
  const value = useMemo(
    () => ({ items: state.items, total: cartTotal(state.items), count: cartCount(state.items), dispatch }),
    [state]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
