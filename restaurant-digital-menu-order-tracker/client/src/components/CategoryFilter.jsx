export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="chips">
      <button className={`chip ${selected === '' ? 'chip-active' : ''}`} onClick={() => onSelect('')}>All</button>
      {categories.map((c) => (
        <button key={c.id} className={`chip ${String(c.id) === String(selected) ? 'chip-active' : ''}`} onClick={() => onSelect(String(c.id))}>
          {c.name}
        </button>
      ))}
    </div>
  );
}
