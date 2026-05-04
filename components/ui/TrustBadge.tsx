"use client";

interface TrustBadgeProps {
  tier: string;
  className?: string;
}

export function TrustBadge({ tier, className = "" }: TrustBadgeProps) {
  const normalizedTier = (tier || "").toLowerCase();
  const config = {
    new: {
      emoji: "&#127999;",
      label: "New",
      color: "text-zinc-400 border-zinc-100 bg-zinc-50",
    },
    rising: {
      emoji: "&#11088;",
      label: "Rising",
      color: "text-sky-600 border-sky-100 bg-sky-50",
    },
    verified: {
      emoji: "&#9989;",
      label: "Verified",
      color: "text-indigo-600 border-indigo-100 bg-indigo-50",
    },
    elite: {
      emoji: "&#127942;",
      label: "Elite",
      color: "text-amber-600 border-amber-100 bg-amber-50 shadow-sm",
    },
  }[normalizedTier] || {
    emoji: "&#127999;",
    label: "New",
    color: "text-zinc-400 border-zinc-100 bg-zinc-50",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[9px] font-bold uppercase tracking-wider ${config.color} ${className}`}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </div>
  );
}
