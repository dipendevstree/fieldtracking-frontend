import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import StatusBadge from "@/components/shared/common-status-badge";

export const expanseReportsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "salesRep",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Sales Rep" />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "expanse_date",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Expanse Date" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "created_date",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Created Date" />
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
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <StatusBadge status={status as any} />;
    },
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
