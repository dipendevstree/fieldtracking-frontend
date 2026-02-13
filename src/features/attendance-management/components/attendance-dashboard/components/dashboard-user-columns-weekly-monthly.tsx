import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StatusBadge from "@/components/shared/common-status-badge";
import { formatWorkHours } from "@/utils/commonFunction";

export const dashboardUserColumnsWeeklyMonthly: ColumnDef<any>[] = [
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
          <div className="font-medium text-sm">{fullName}</div>
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
    accessorKey: "territory",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Territory" />
    ),
    cell: ({ row }) => {
      const territory = row.original.territory;
      return <div className="text-sm">{territory || "-"}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "shiftTotalHours",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Required Hours" />
    ),
    cell: ({ row }) => {
      const shiftTotalHours = row.original.shiftTotalHours;
      return (
        <div className="text-sm font-medium">
          {formatWorkHours(shiftTotalHours)}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "totalWorkHours",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Worked Hours" />
    ),
    cell: ({ row }) => {
      const totalWorkHours = row.original.totalWorkHours;
      return (
        <div className="text-sm font-medium">
          {formatWorkHours(totalWorkHours)}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "workStatus",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const workStatus = row.original.workStatus;
      return <StatusBadge status={workStatus} />;
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

export default dashboardUserColumnsWeeklyMonthly;
