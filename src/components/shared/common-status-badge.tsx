import React from "react";
import { cn } from "@/lib/utils";

type StatusType = string;

interface StatusBadgeProps {
  status: StatusType;
}

const statusColors: Record<string, { text: string; bg: string; dot: string }> =
  {
    complete: {
      text: "text-green-600",
      bg: "bg-green-100",
      dot: "bg-green-500",
    },
    pending: {
      text: "text-red-600",
      bg: "bg-red-100",
      dot: "bg-red-500",
    },
    in_progress: {
      text: "text-yellow-600",
      bg: "bg-yellow-100",
      dot: "bg-yellow-500",
    },
    approved: {
      text: "text-blue-600",
      bg: "bg-blue-100",
      dot: "bg-blue-500",
    },
    // fallback will handle unknown statuses
  };

function formatStatusTitle(status: string): string {
  return status
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\s+/g, " ") // Remove extra spaces
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
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
