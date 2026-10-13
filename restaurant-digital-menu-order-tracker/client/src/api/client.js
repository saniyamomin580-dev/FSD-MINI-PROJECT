import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

// Send the admin password (if logged in) with every request.
api.interceptors.request.use((config) => {
  const key = sessionStorage.getItem('adminKey');
  if (key) config.headers['x-admin-key'] = key;
  return config;
});

// Turns any Axios error into one readable message (including server validation errors).
export function errorMessage(err) {
  if (!err.response) return 'Cannot reach the server. Is the backend running on port 5000?';
  const { message, errors } = err.response.data || {};
  return errors && errors.length ? `${message}: ${errors.join(' ')}` : message || 'Something went wrong.';
}
