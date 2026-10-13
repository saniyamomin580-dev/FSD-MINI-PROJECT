import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { errorMessage } from '../api/client.js';
import ErrorBox from '../components/ErrorBox.jsx';

export default function AdminLogin() {
  const { isAdmin, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!password) return setError('Please enter the admin password.');
    setBusy(true);
    setError('');
    try {
      await login(password);
      showToast('Welcome, admin!');
      navigate('/admin');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card form narrow" onSubmit={submit}>
      <h2>Admin login</h2>
      <p className="muted">Demo login. The password is ADMIN_KEY from server/.env.</p>
      <input className="input" type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <ErrorBox message={error} />
      <button className="btn btn-block" disabled={busy}>{busy ? 'Checking...' : 'Log in'}</button>
    </form>
  );
}
