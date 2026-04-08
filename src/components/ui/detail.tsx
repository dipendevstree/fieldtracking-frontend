import { cn } from "@/lib/utils";

export function Detail({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <p className="text-muted-foreground font-medium">{label}</p>
      <p>{value}</p>
    </div>
  );
}
