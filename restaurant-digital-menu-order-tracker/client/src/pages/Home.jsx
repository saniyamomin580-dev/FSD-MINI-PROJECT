import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

export default function Home() {
  const { data: categories, loading, error, reload } = useFetch('/categories');

  return (
    <>
      <section className="hero">
        <h1>Welcome to Saffron &amp; Salt</h1>
        <p>Browse our digital menu, order from your table and follow your order live — no waiting for the waiter.</p>
        <div className="hero-actions">
          <Link to="/menu" className="btn">View Menu</Link>
          <Link to="/track" className="btn btn-light">Track My Order</Link>
        </div>
      </section>

      <h2 className="section-title">Explore our categories</h2>
      {loading && <Loader />}
      <ErrorBox message={error} onRetry={reload} />
      <div className="grid-4">
        {categories && categories.map((c) => (
          <Link key={c.id} to={`/menu?category=${c.id}`} className="card category-card">
            <h3>{c.name}</h3>
            <p className="muted">{c.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
