import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import StatusBadge from "@/components/shared/common-status-badge";

export const dashboardUserColumns: ColumnDef<any>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Employee" />
    ),
    cell: ({ row }) => {
      const { fullName } = row.original;
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {fullName?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{fullName}</div>
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      const department = row.original.department;
      return <div className="text-sm">{department || "-"}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "teritory",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Territory" />
    ),
    cell: ({ row }) => {
      const territory = row.original.teritory;
      return <div className="text-sm">{territory ? territory : "-"}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "checkIn",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Check In" />
    ),
    cell: ({ row }) => {
      const checkIn = row.original.checkIn;
      const formattedTime = checkIn
        ? format(new Date(checkIn), "hh:mm a")
        : "-";

      return <div className="text-sm">{formattedTime}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "checkOut",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Check Out" />
    ),
    cell: ({ row }) => {
      const checkOut = row.original.checkOut;
      const formattedTime = checkOut
        ? format(new Date(checkOut), "hh:mm a")
        : "-";

      return <div className="text-sm">{formattedTime}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "totalWorkHours",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Work Hours" />
    ),
    cell: ({ row }) => {
      const totalWorkHours = row.original.totalWorkHours;
      return (
        <div className="text-sm font-medium">
          {totalWorkHours?.toFixed(2) || "0.00"} hrs
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return <StatusBadge status={status} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "shiftName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Shift" />
    ),
    cell: ({ row }) => {
      const shiftName = row.original.shiftName;
      return <div className="text-sm">{shiftName || "-"}</div>;
    },
    enableSorting: false,
  },
];

export default dashboardUserColumns;
