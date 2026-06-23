interface RatingDisplayProps {
  label: string;
  value: number;
  max?: number;
  highlight?: boolean;
}

export default function RatingDisplay({ label, value, max = 5, highlight = false }: RatingDisplayProps) {
  const pct = value > 0 ? (value / max) * 100 : 0;

  const barColor =
    value >= 4 ? "bg-emerald-400" :
    value >= 3 ? "bg-blue-400" :
    value >= 2 ? "bg-amber-400" :
    "bg-red-400";

  return (
    <div className={`flex items-center gap-4 py-2 ${highlight ? "bg-blue-50/50 -mx-2 px-2 rounded-lg" : ""}`}>
      <span className="text-sm text-gray-600 w-52 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-sm font-semibold w-8 text-right tabular-nums ${value >= 4 ? "text-emerald-600" : value >= 3 ? "text-blue-600" : value > 0 ? "text-amber-600" : "text-gray-300"}`}>
        {value > 0 ? value.toFixed(1) : "—"}
      </span>
    </div>
  );
}
