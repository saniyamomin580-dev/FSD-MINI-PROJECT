import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="container page"><Outlet /></main>
      <footer className="footer">© Saffron &amp; Salt — college mini project (no real payments)</footer>
    </>
  );
}
