import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { DataTableRowActions } from "./daily-expense-table-action-button";
import StatusBadge from "@/components/shared/common-status-badge";

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
      <CustomDataTableColumnHeader column={column} title="Expense Type" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const value = row.getValue("expenseType");

      const formatExpenseType = (type: string): string => {
        const map: Record<string, string> = {
          travel: "Travel Allowance",
          daily: "Daily Allowance",
        };

        return map[type.toLowerCase()] || type;
      };

      return formatExpenseType(String(value));
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
  {
    id: "actions",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
