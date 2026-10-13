export default function ErrorBox({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="error-box" role="alert">
      <span>{message}</span>
      {onRetry && <button className="btn btn-small btn-outline" onClick={onRetry}>Try again</button>}
    </div>
  );
}
