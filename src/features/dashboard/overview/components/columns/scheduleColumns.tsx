import LongText from "@/components/long-text";
import StatusBadge from "@/components/ui/status-badge";
import { ColumnDef } from "@tanstack/react-table";

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
    accessorKey: "displayPriority",
    header: "Priority",
    cell: ({ row }) => (
      <StatusBadge status={(row.original as any).displayPriority} />
    ),
  },
  {
    accessorKey: "formattedDateTime",
    header: "Date & Time",
    cell: ({ row }) => <div>{(row.original as any).formattedDateTime}</div>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <LongText className="max-w-[250px]">
        {(row.original as any).location}
      </LongText>
    ),
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
    cell: ({ row }) => <div>{(row.original as any).purpose || "N/A"}</div>,
  },
  {
    accessorKey: "displayStatus",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={(row.original as any).displayStatus} />
    ),
  },
];
