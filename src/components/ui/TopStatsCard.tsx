import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NavigateOptions, useNavigate } from "@tanstack/react-router";

// Define the color themes matching the screenshot style (Light BG, Dark Text)
const colorMap = {
  default: {
    bg: "bg-white",
    text: "text-slate-700",
    icon: "text-slate-400",
    border: "border-slate-100",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: "text-blue-600",
    border: "border-blue-100",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: "text-green-600",
    border: "border-green-100",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: "text-red-600",
    border: "border-red-100",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    icon: "text-orange-600",
    border: "border-orange-100",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    icon: "text-yellow-600",
    border: "border-yellow-100",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    icon: "text-purple-600",
    border: "border-purple-100",
  },
  amber:{
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: "text-amber-600",
    border: "border-amber-100",
  }
};

export type StatCardTheme = keyof typeof colorMap;

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  className?: string;
  themeColor?: StatCardTheme;
  href?: NavigateOptions;
}

export function TopStatsCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  themeColor = "default",
  href,
}: StatsCardProps) {
  const styles = colorMap[themeColor];
  const navigate = useNavigate();
  return (
    <Card
      className={cn(
        "shadow-sm border-slate-200 overflow-hidden",
        className,
        href ? "cursor-pointer" : "",
      )}
      {...(href ? { onClick: () => navigate(href) } : {})}
    >
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between py-3",
          styles.bg,
          styles.border,
        )}
      >
        <CardTitle className={cn("text-sm font-semibold", styles.text)}>
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", styles.icon)} />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
