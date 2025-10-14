import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import StatusBadge from "@/components/shared/common-status-badge";

export const expanseReportsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "salesRepresentativeName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Sales Rep" />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorFn: (row) => {
      const date = row.startDate ?? row.date;
      return date ? format(new Date(date), "dd/MM/yyyy") : "-";
    },
    id: "expanseDate",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Expanse Date" />
    ),
    enableSorting: false,
  },
  {
    accessorFn: (row) => {
      const date = row.createdDate;
      return date ? format(new Date(date), "dd/MM/yyyy") : "-";
    },
    id: "createdDate",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Created Date" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "expenseCategoryName",
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
    accessorKey: "amount",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Total amount" />
    ),
    enableSorting: false,
  },
];
