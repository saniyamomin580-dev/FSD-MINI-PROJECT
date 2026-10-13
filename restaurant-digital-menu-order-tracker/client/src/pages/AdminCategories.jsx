import { useState } from 'react';
import { api, errorMessage } from '../api/client.js';
import useFetch from '../hooks/useFetch.js';
import { useToast } from '../context/ToastContext.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

export default function AdminCategories() {
  const cats = useFetch('/categories');
  const { showToast } = useToast();
  const [form, setForm] = useState({ id: null, name: '', description: '' });
  const [error, setError] = useState('');

  const reset = () => setForm({ id: null, name: '', description: '' });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Category name must be at least 2 characters.');
    const body = { name: form.name.trim(), description: form.description.trim() };
    try {
      if (form.id) await api.put(`/categories/${form.id}`, body);
      else await api.post('/categories', body);
      showToast(form.id ? 'Category updated' : 'Category added');
      reset();
      cats.reload();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    try {
      await api.delete(`/categories/${c.id}`);
      showToast('Category deleted');
      cats.reload();
    } catch (err) {
      showToast(errorMessage(err), 'error');
    }
  };

  return (
    <div className="grid-2">
      <form className="card form" onSubmit={submit}>
        <h3>{form.id ? 'Edit category' : 'Add category'}</h3>
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <ErrorBox message={error} />
        <div className="form-actions">
          {form.id && <button type="button" className="btn btn-outline" onClick={reset}>Cancel</button>}
          <button className="btn" type="submit">{form.id ? 'Update' : 'Add'}</button>
        </div>
      </form>
      <div className="card">
        <h3>Categories</h3>
        {cats.loading && <Loader />}
        <ErrorBox message={cats.error} onRetry={cats.reload} />
        {cats.data && (
          <table className="table">
            <thead><tr><th>Name</th><th>Description</th><th /></tr></thead>
            <tbody>
              {cats.data.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td><td className="muted">{c.description}</td>
                  <td className="actions">
                    <button className="btn btn-small btn-outline" onClick={() => setForm({ id: c.id, name: c.name, description: c.description || '' })}>Edit</button>
                    <button className="btn btn-small btn-danger" onClick={() => remove(c)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
