import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { DataTableRowActions } from "./table-action-button";
import { format } from "date-fns";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "typeName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Customer Type" />
    ),
    cell: ({ row }) => {
      const customerType = row.original.typeName || "";
      return <div className="text-sm font-medium">{customerType}</div>;
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

      return <div className=" text-sm">{formattedDate}</div>;
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
