export default function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-2xl glass-card animate-pulse"
        >
          <div className="w-16 h-16 rounded-xl bg-gray-700/80" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700/80 rounded w-3/4" />
            <div className="h-3 bg-gray-700/60 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
