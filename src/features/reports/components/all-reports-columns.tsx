import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "salesRep",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Sales Rep" />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Date" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "expense_category",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Expense Category" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Status" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "total_amount",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Total amount" />
    ),
    enableSorting: false,
  },
];
