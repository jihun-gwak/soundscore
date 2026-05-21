export default function ErrorAlert({
  message,
  title,
  variant = "error",
  onRetry,
  className = "",
}) {
  if (!message) return null;

  const styles = {
    error: "bg-red-500/10 border-red-500/50 text-red-400",
    warning: "bg-amber-500/10 border-amber-500/50 text-amber-300",
    info: "bg-blue-500/10 border-blue-500/50 text-blue-300",
  };

  return (
    <div
      role="alert"
      className={`rounded-lg border p-4 ${styles[variant] || styles.error} ${className}`}
    >
      {title && <p className="font-semibold mb-1">{title}</p>}
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-sm font-medium underline hover:no-underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
