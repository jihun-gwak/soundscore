"use client";

export default function StarRating({ value, max = 10, size = "md" }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const heights = { sm: "h-1.5", md: "h-2", lg: "h-3" };

  return (
    <div className={`flex items-center gap-2 ${heights[size]}`}>
      <div
        className={`flex-1 max-w-[120px] ${heights[size]} bg-gray-700/80 rounded-full overflow-hidden`}
      >
        <div
          className={`${heights[size]} rounded-full bg-gradient-to-r from-accent-muted to-accent transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`font-bold tabular-nums text-accent ${
          size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base"
        }`}
      >
        {Number(value).toFixed(value % 1 === 0 ? 0 : 1)}/{max}
      </span>
    </div>
  );
}
