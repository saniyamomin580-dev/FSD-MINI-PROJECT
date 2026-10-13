import { useEffect, useRef } from 'react';

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);
  useEffect(() => inputRef.current?.focus(), []); // focus the box when the page opens

  return (
    <input
      ref={inputRef}
      className="input search"
      type="search"
      placeholder="Search food by name..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search food"
    />
  );
}
