import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { LeaveTypeRowActions } from "./table-action-button";

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
    accessorKey: "leaveBalance",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Balance (Days)" />
    ),
    cell: ({ row }) => {
      return <div className="text-sm ">{row.original.leaveBalance} </div>;
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
    id: "actions",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <LeaveTypeRowActions row={row} />,
  },
];

export default leaveTypeColumns;
