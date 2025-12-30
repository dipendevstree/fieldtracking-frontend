import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { PendingLeaveRowActions } from "./pending-leave-table-action-button";
import moment from "moment";
import { formatDropDownLabel } from "@/utils/commonFunction";
import StatusBadge from "@/components/shared/common-status-badge";

export const pendingLeaveColumns: ColumnDef<any>[] = [
  {
    accessorKey: "leaveType.name",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Leave Type" />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="User Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm ">
          {row.original.user?.firstName +
            " " +
            row.original.user?.lastName}{" "}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "dateRange",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="text-sm capitalize">
        {moment(row.original.startDate).format("DD/MM/YYYY") +
          " - " +
          moment(row.original.endDate).format("DD/MM/YYYY")}
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "reason",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Reason" />
    ),
    cell: ({ row }) => {
      return <div className="text-sm truncate">{row.original.reason}</div>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => {
      if (row.original?.halfDay) {
        return (
          <div className="text-sm">
            {formatDropDownLabel(row.original.halfDayType)}
          </div>
        );
      }
      const startDate = moment(row.original.startDate);
      const endDate = moment(row.original.endDate);
      const duration = endDate.diff(startDate, "days") + 1;
      return (
        <div className="text-sm">
          {duration} {duration > 1 ? "Days" : "Day"}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm ">
          <StatusBadge status={row.original.status} />
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <PendingLeaveRowActions row={row} />,
  },
];

export default pendingLeaveColumns;
