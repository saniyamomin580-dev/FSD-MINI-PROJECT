export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close" aria-label="Close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}
