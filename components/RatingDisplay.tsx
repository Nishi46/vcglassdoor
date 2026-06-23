interface RatingDisplayProps {
  label: string;
  value: number;
  max?: number;
}

export default function RatingDisplay({ label, value, max = 5 }: RatingDisplayProps) {
  const pct = value > 0 ? (value / max) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 w-44 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className="bg-gray-800 h-2 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium w-8 text-right">
        {value > 0 ? value.toFixed(1) : "—"}
      </span>
    </div>
  );
}
