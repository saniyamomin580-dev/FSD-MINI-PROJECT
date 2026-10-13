import { Routes, Route, Link } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import Checkout from './pages/Checkout.jsx';
import TrackOrder from './pages/TrackOrder.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import AdminMenu from './pages/AdminMenu.jsx';
import AdminCategories from './pages/AdminCategories.jsx';

function NotFound() {
  return (
    <div className="card center">
      <h2>Page not found</h2>
      <Link to="/" className="btn">Go home</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/track/:id" element={<TrackOrder />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
