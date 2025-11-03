import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { Badge } from "@/components/ui/badge";
import { TermsAndConditions } from "../types";

import { cn } from "@/lib/utils";
import { DataTableRowActions } from "./table-action-button";

// Helper to format the enum type for display
const formatType = (type: string) => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const termsColumns: ColumnDef<TermsAndConditions>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div>{formatType(row.original.type)}</div>,
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Created Date" />
    ),
    cell: ({ row }) => {
      const formattedDate = format(
        new Date(row.original.createdDate),
        "dd-MM-yyyy"
      );
      return (
        <div className="text-sm text-muted-foreground">{formattedDate}</div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        className={cn(
          "text-xs",
          row.original.isActive
            ? "border-green-600 bg-green-50 text-green-700"
            : "border-gray-600 bg-gray-50 text-gray-700"
        )}
        variant="outline"
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
