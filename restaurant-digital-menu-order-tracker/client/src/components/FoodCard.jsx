import { memo } from 'react';
import { formatCurrency } from '../utils/format.js';

function FoodCard({ item, quantityInCart, onAdd }) {
  return (
    <article className={`food-card ${item.isAvailable ? '' : 'food-unavailable'}`}>
      <img
        src={item.imageUrl || '/images/placeholder.svg'}
        alt={item.name}
        loading="lazy"
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg'; }}
      />
      <div className="food-body">
        <div className="food-top">
          <h3>{item.name}</h3>
          <span className={`diet ${item.isVegetarian ? 'veg' : 'nonveg'}`} title={item.isVegetarian ? 'Vegetarian' : 'Non-vegetarian'} />
        </div>
        <p className="muted">{item.description}</p>
        <div className="food-bottom">
          <strong>{formatCurrency(item.price)}</strong>
          {item.isAvailable ? (
            <button className="btn btn-small" onClick={() => onAdd(item)}>
              Add{quantityInCart > 0 ? ` (${quantityInCart})` : ''}
            </button>
          ) : (
            <span className="badge badge-unavailable">Unavailable</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(FoodCard);
