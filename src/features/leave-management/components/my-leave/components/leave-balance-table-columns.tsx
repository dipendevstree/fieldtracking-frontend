import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { ColumnDef } from "@tanstack/react-table";

export const leaveBalanceColumns: ColumnDef<any>[] = [
  {
    accessorKey: "leaveType.name",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Leave Type" />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Year" />
    ),
    cell: ({ row }) => {
      return <div className="text-sm ">{row.original.year}</div>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => (
      <div className="text-sm capitalize">
        {row.original.carryForward
          ? `${Number(row.original.carryForward) + Number(row.original.earned)} (Earned: ${row.original.earned} + Carry Forward: ${row.original.carryForward})`
          : row.original.earned}
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "used",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Taken" />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "remaining",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Balance" />
    ),
    enableHiding: false,
    enableSorting: false,
  },
];

export default leaveBalanceColumns;
