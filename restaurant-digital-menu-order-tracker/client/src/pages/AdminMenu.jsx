import { useState } from 'react';
import { api, errorMessage } from '../api/client.js';
import useFetch from '../hooks/useFetch.js';
import { useToast } from '../context/ToastContext.jsx';
import MenuItemForm from '../components/MenuItemForm.jsx';
import Modal from '../components/Modal.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';
import { formatCurrency } from '../utils/format.js';

export default function AdminMenu() {
  const menu = useFetch('/menu');
  const cats = useFetch('/categories');
  const { showToast } = useToast();
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = adding, object = editing
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const save = async (values) => {
    setSaving(true);
    setFormError('');
    try {
      if (editing) await api.put(`/menu/${editing.id}`, values);
      else await api.post('/menu', values);
      showToast(editing ? 'Menu item updated' : 'Menu item added');
      setEditing(undefined);
      menu.reload();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailable = async (item) => {
    try {
      await api.put(`/menu/${item.id}`, { isAvailable: !item.isAvailable });
      showToast(`${item.name} is now ${item.isAvailable ? 'unavailable' : 'available'}`);
      menu.reload();
    } catch (err) {
      showToast(errorMessage(err), 'error');
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/menu/${item.id}`);
      showToast('Menu item deleted');
      menu.reload();
    } catch (err) {
      showToast(errorMessage(err), 'error');
    }
  };

  return (
    <div className="card">
      <div className="between">
        <h3>Menu items</h3>
        <button className="btn" disabled={!cats.data} onClick={() => { setFormError(''); setEditing(null); }}>+ Add item</button>
      </div>
      {menu.loading && <Loader />}
      <ErrorBox message={menu.error || cats.error} onRetry={menu.reload} />
      {menu.data && (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Type</th><th>Available</th><th /></tr></thead>
            <tbody>
              {menu.data.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category && item.category.name}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td><span className={`diet ${item.isVegetarian ? 'veg' : 'nonveg'}`} /> {item.isVegetarian ? 'Veg' : 'Non-veg'}</td>
                  <td>
                    <label className="switch">
                      <input type="checkbox" checked={item.isAvailable} onChange={() => toggleAvailable(item)} />
                      <span>{item.isAvailable ? 'Yes' : 'No'}</span>
                    </label>
                  </td>
                  <td className="actions">
                    <button className="btn btn-small btn-outline" onClick={() => { setFormError(''); setEditing(item); }}>Edit</button>
                    <button className="btn btn-small btn-danger" onClick={() => remove(item)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing !== undefined && cats.data && (
        <Modal title="Menu item" onClose={() => setEditing(undefined)}>
          <h3>{editing ? 'Edit menu item' : 'Add menu item'}</h3>
          <ErrorBox message={formError} />
          <MenuItemForm initial={editing} categories={cats.data} saving={saving} onSubmit={save} onCancel={() => setEditing(undefined)} />
        </Modal>
      )}
    </div>
  );
}
