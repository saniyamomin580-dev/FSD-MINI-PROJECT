import { useState } from 'react';

const empty = { name: '', description: '', price: '', categoryId: '', imageUrl: '', isVegetarian: true, isAvailable: true };

// Used for both "Add" and "Edit". `initial` is null when adding.
export default function MenuItemForm({ initial, categories, saving, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial ? { ...empty, ...initial, price: String(initial.price), imageUrl: initial.imageUrl || '', description: initial.description || '' } : { ...empty, categoryId: categories[0] ? String(categories[0].id) : '' });
  const [errors, setErrors] = useState({});

  const change = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!(Number(form.price) > 0)) e.price = 'Price must be greater than 0.';
    if (!form.categoryId) e.categoryId = 'Please choose a category.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, name: form.name.trim(), price: Number(form.price), categoryId: Number(form.categoryId), imageUrl: form.imageUrl.trim() || null });
  };

  return (
    <form onSubmit={submit} className="form" noValidate>
      <label>Name
        <input className="input" name="name" value={form.name} onChange={change} />
        {errors.name && <small className="field-error">{errors.name}</small>}
      </label>
      <label>Description
        <textarea className="input" name="description" rows="2" value={form.description} onChange={change} />
      </label>
      <div className="grid-2">
        <label>Price (₹)
          <input className="input" name="price" type="number" step="0.01" min="0" value={form.price} onChange={change} />
          {errors.price && <small className="field-error">{errors.price}</small>}
        </label>
        <label>Category
          <select className="input" name="categoryId" value={form.categoryId} onChange={change}>
            <option value="">Select...</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.categoryId && <small className="field-error">{errors.categoryId}</small>}
        </label>
      </div>
      <label>Image URL (optional, e.g. /images/dal-tadka.svg)
        <input className="input" name="imageUrl" value={form.imageUrl} onChange={change} />
      </label>
      <div className="checks">
        <label><input type="checkbox" name="isVegetarian" checked={form.isVegetarian} onChange={change} /> Vegetarian</label>
        <label><input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={change} /> Available</label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save item'}</button>
      </div>
    </form>
  );
}
