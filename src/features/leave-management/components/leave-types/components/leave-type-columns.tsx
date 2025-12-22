import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { LeaveTypeRowActions } from "./table-action-button";
import StatusBadge from "@/components/shared/common-status-badge";

export const leaveTypeColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Leave Type" />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Balance (Days)" />
    ),
    cell: ({ row }) => {
      return <div className="text-sm ">{row.original.balance} </div>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "allocationPeriod",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Allocation Period" />
    ),
    cell: ({ row }) => (
      <div className="text-sm capitalize">{row.original.allocationPeriod}</div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {<StatusBadge status={row.original.status} />}
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <LeaveTypeRowActions row={row} />,
  },
];

export default leaveTypeColumns;
