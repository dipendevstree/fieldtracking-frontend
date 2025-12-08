import CustomTooltip from "@/components/shared/custom-tooltip";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

const truncateLocation = (location: string, maxLength: number = 50) => {
  if (!location) return "N/A";
  if (location.length <= maxLength) return location;
  return location.substring(0, maxLength) + "...";
};

export const scheduleColumns: ColumnDef<unknown>[] = [
  {
    accessorKey: "salesRepName",
    header: "Sales Rep",
    cell: ({ row }) => (
      <div className="font-medium">{(row.original as any).salesRepName}</div>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => <div>{(row.original as any).customerName}</div>,
  },
  {
    accessorKey: "formattedDateTime",
    header: "Date & Time",
    cell: ({ row }) => <div>{(row.original as any).formattedDateTime}</div>,
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
    cell: ({ row }) => <div>{(row.original as any).purpose || "N/A"}</div>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <CustomTooltip
        title={(row.original as any).location}
      >
        {truncateLocation((row.original as any).location)}
      </CustomTooltip>
    ),
  },
  {
    accessorKey: "displayStatus",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          (row.original as any).displayStatus.toLowerCase() === "completed"
            ? "default"
            : "secondary"
        }
      >
        {(row.original as any).displayStatus}
      </Badge>
    ),
  },
  {
    accessorKey: "displayPriority",
    header: "Priority",
    cell: ({ row }) => (
      <Badge variant="outline">{(row.original as any).displayPriority}</Badge>
    ),
  },
];
