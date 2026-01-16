import React from "react";
import { cn } from "@/lib/utils";

type StatusType = string;

interface StatusBadgeProps {
  status: StatusType;
}

export const statusColors: Record<
  string,
  { text: string; bg: string; dot: string }
> = {
  pending: {
    text: "text-orange-600",
    bg: "bg-orange-100",
    dot: "bg-orange-500",
  },
  partially_approved: {
    text: "text-yellow-600",
    bg: "bg-yellow-100",
    dot: "bg-yellow-500",
  },
  approved: {
    text: "text-green-600",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },
  complete: {
    text: "text-blue-600",
    bg: "bg-blue-100",
    dot: "bg-blue-500",
  },
  completed: {
    text: "text-green-600",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },
  in_progress: {
    text: "text-orange-600",
    bg: "bg-orange-100",
    dot: "bg-orange-500",
  },
  processing: {
    text: "text-orange-600",
    bg: "bg-orange-100",
    dot: "bg-orange-500",
  },
  success: {
    text: "text-green-600",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },
  verified: {
    text: "text-green-600",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },
  rejected: {
    text: "text-red-600",
    bg: "bg-red-100",
    dot: "bg-red-500",
  },
  reject: {
    text: "text-red-600",
    bg: "bg-red-100",
    dot: "bg-red-500",
  },
  failure: {
    text: "text-red-600",
    bg: "bg-red-100",
    dot: "bg-red-500",
  },
  inactive: {
    text: "text-gray-600",
    bg: "bg-gray-100",
    dot: "bg-gray-500",
  },
  active: {
    text: "text-green-600",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },
  // Holiday Types
  national: {
    text: "text-blue-600",
    bg: "bg-blue-100",
    dot: "bg-blue-500",
  },
  festival: {
    text: "text-purple-600",
    bg: "bg-purple-100",
    dot: "bg-purple-500",
  },
  regional: {
    text: "text-purple-600",
    bg: "bg-purple-100",
    dot: "bg-purple-500",
  },
  optional: {
    text: "text-emerald-600",
    bg: "bg-emerald-100",
    dot: "bg-emerald-500",
  },
  weekend: {
    text: "text-orange-600",
    bg: "bg-orange-100",
    dot: "bg-orange-500",
  },
  // Half Day Types
  first_half: {
    text: "text-gray-600",
    bg: "bg-gray-100",
    dot: "bg-gray-500",
  },
  second_half: {
    text: "text-gray-600",
    bg: "bg-gray-100",
    dot: "bg-gray-500",
  },
  cancel: {
    text: "text-red-600",
    bg: "bg-red-100",
    dot: "bg-red-500",
  },
  // Attendance Statuses
  present: {
    text: "text-green-600",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },
  late: {
    text: "text-yellow-700",
    bg: "bg-yellow-100",
    dot: "bg-yellow-500",
  },
  "early exit": {
    text: "text-amber-700",
    bg: "bg-amber-100",
    dot: "bg-amber-600",
  },
  early_exit: {
    text: "text-amber-700",
    bg: "bg-amber-100",
    dot: "bg-amber-600",
  },
  "half day": {
    text: "text-blue-600",
    bg: "bg-blue-100",
    dot: "bg-blue-500",
  },
  half_day: {
    text: "text-blue-600",
    bg: "bg-blue-100",
    dot: "bg-blue-500",
  },
  leave: {
    text: "text-orange-600",
    bg: "bg-orange-100",
    dot: "bg-orange-500",
  },
  absent: {
    text: "text-red-600",
    bg: "bg-red-100",
    dot: "bg-red-500",
  },
  "week off / holiday": {
    text: "text-slate-600",
    bg: "bg-slate-100",
    dot: "bg-slate-400",
  },
  week_off: {
    text: "text-slate-600",
    bg: "bg-slate-100",
    dot: "bg-slate-400",
  },
  holiday: {
    text: "text-slate-600",
    bg: "bg-slate-100",
    dot: "bg-slate-400",
  },
  under: {
    text: "text-red-600",
    bg: "bg-red-100",
    dot: "bg-red-500",
  },
  over: {
    text: "text-green-600",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },
  normal: {
    text: "text-green-600",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },
  add: {
    text: "text-green-600",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },
  deduct: {
    text: "text-red-600",
    bg: "bg-red-100",
    dot: "bg-red-500",
  },
};

function formatStatusTitle(status: string): string {
  return status
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\s+/g, " ") // Remove extra spaces
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (!status) {
    return "-";
  }

  const normalizedStatus = status.toLowerCase();
  const color = statusColors[normalizedStatus] || {
    text: "text-gray-600",
    bg: "bg-gray-100",
    dot: "bg-gray-500",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        color.text,
        color.bg
      )}
    >
      <span className={cn("mr-1 h-2 w-2 rounded-full", color.dot)}></span>
      {formatStatusTitle(normalizedStatus)}
    </div>
  );
};

export default StatusBadge;
