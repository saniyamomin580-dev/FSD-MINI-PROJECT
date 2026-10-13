import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import useDebounce from '../hooks/useDebounce.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import FoodCard from '../components/FoodCard.jsx';
import CartPanel from '../components/CartPanel.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const categoryId = searchParams.get('category') || '';

  const { items: cartItems, dispatch } = useCart();
  const { showToast } = useToast();

  const cats = useFetch('/categories');
  const menu = useFetch('/menu', { q: debouncedSearch, categoryId });

  const handleAdd = useCallback((item) => {
    dispatch({ type: 'ADD', item });
    showToast(`${item.name} added to cart`);
  }, [dispatch, showToast]);

  const selectCategory = (id) => setSearchParams(id ? { category: id } : {});

  // Group items by category name for display (recalculated only when the data changes).
  const groups = useMemo(() => {
    const map = {};
    (menu.data || []).forEach((item) => {
      const name = item.category ? item.category.name : 'Other';
      (map[name] = map[name] || []).push(item);
    });
    return Object.entries(map);
  }, [menu.data]);

  const qtyInCart = (id) => (cartItems.find((i) => i.id === id) || {}).quantity || 0;

  return (
    <div className="menu-layout">
      <section>
        <h1>Our Menu</h1>
        <div className="toolbar">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        {cats.data && <CategoryFilter categories={cats.data} selected={categoryId} onSelect={selectCategory} />}
        <ErrorBox message={cats.error || menu.error} onRetry={menu.reload} />
        {menu.loading && <Loader text="Loading menu..." />}
        {!menu.loading && !menu.error && groups.length === 0 && <p className="muted">No dishes match your search.</p>}
        {groups.map(([name, list]) => (
          <div key={name}>
            <h2 className="section-title">{name}</h2>
            <div className="grid-cards">
              {list.map((item) => (
                <FoodCard key={item.id} item={item} quantityInCart={qtyInCart(item.id)} onAdd={handleAdd} />
              ))}
            </div>
          </div>
        ))}
      </section>
      <CartPanel />
    </div>
  );
}
