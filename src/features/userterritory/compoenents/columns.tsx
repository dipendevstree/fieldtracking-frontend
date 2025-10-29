import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { DataTableRowActions } from "./table-action-button";
import { format } from "date-fns";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "territory",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Territory" />
    ),
    cell: ({ row }) => {
      const territory = row.original.name || "-";
      return <div className="text-sm font-medium">{territory}</div>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Created Date" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt || row.original.createdDate;

      const formattedDate = createdAt
        ? format(new Date(createdAt), "dd-MM-yyyy")
        : "-";

      return (
        <div className="text-muted-foreground text-sm">{formattedDate}</div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "userCount",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="User Count" />
    ),
    cell: ({ row }) => {
      const userCount = row.original.userCount || 0;
      return <div className="text-muted-foreground text-sm">{userCount}</div>;
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
  },
];
