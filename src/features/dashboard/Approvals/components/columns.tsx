import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import StatusBadge from '@/components/shared/common-status-badge'
import {
  formatExpenseSubType,
  formatExpenseType,
} from '@/utils/commonFormatters'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "salesRep",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Sales Rep" />
    ),
    cell: ({ row }) => {
      const user = row.original.salesRepresentativeUser;
      const firstName = user?.firstName || "";
      const lastName = user?.lastName || "";
      const fullName =
        firstName || lastName ? `${firstName} ${lastName}`.trim() : "-";

      return (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{fullName}</span>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.createdDate || "";
      const formattedDate = date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "-";
      return <div className=" text-sm">{formattedDate}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Amount" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "expenseType",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Type" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const value = row.getValue("expenseType");
      return formatExpenseType(String(value));
    },
  },
  {
    accessorKey: "expenseSubType",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Sub Type" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const value = row.getValue("expenseSubType");
      return formatExpenseSubType(String(value));
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status || "";

      return <StatusBadge status={status} />;
    },
    enableSorting: false,
  },
 
];
