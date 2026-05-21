"use client";

export default function ScoreBadge({ score, count, size = "md" }) {
  if (score == null) return null;

  const sizes = {
    sm: "w-14 h-14 text-lg",
    md: "w-20 h-20 text-2xl",
    lg: "w-28 h-28 text-4xl",
  };

  const grade =
    score >= 8 ? "from-accent to-emerald-400" :
    score >= 6 ? "from-lime-500 to-accent" :
    score >= 4 ? "from-amber-500 to-yellow-400" :
    "from-orange-600 to-red-500";

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${sizes[size]} rounded-2xl bg-gradient-to-br ${grade} flex items-center justify-center font-bold shadow-lg shadow-accent/20 ring-2 ring-white/10`}
      >
        {score.toFixed(1)}
      </div>
      {count != null && (
        <span className="text-xs text-gray-500">
          {count} review{count === 1 ? "" : "s"}
        </span>
      )}
    </div>
  );
}
