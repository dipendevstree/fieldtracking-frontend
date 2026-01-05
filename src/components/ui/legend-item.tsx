import { cn } from "@/lib/utils";

type LegendLabel =
  | "present"
  | "late"
  | "early exit"
  | "half day"
  | "leave"
  | "absent"
  | "week off / holiday";

const LEGEND_CONFIG: Record<
  LegendLabel,
  {
    color: string;
  }
> = {
  present: { color: "bg-green-500" },
  late: { color: "bg-yellow-500" },
  "early exit": { color: "bg-amber-600" },
  "half day": { color: "bg-blue-500" },
  leave: { color: "bg-orange-500" },
  absent: { color: "bg-red-500" },
  "week off / holiday": { color: "bg-slate-300" },
};

interface LegendItemProps {
  label: LegendLabel;
  className?: string;
}

const capitalizeFirst = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

export function LegendItem({ label, className }: LegendItemProps) {
  const config = LEGEND_CONFIG[label];

  if (!config) return null;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn("w-3 h-3 rounded-sm", config.color)} />
      <span className="text-sm text-slate-600 font-medium">
        {capitalizeFirst(label)}
      </span>
    </div>
  );
}
