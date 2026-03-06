import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import StatusBadge from "@/components/shared/common-status-badge";
import moment from "moment";
import { formatDropDownLabel } from "@/utils/commonFunction";
import CustomTooltip from "@/components/shared/custom-tooltip";

export const leaveApprovalColumns: ColumnDef<any>[] = [
  {
    accessorKey: "leave.leaveType.name",
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
          {row.original.leave?.user ? row.original.leave?.user?.firstName +
            " " +
            row.original.leave?.user?.lastName : "Unknown User"}{" "}
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
        {moment(row.original.leave?.startDate).format("DD/MM/YYYY") +
          " - " +
          moment(row.original.leave?.endDate).format("DD/MM/YYYY")}
      </div>
    ),
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
      const startDate = moment(row.original.leave?.startDate);
      const endDate = moment(row.original.leave?.endDate);
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
    accessorKey: "comment",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Comment" />
    ),
    cell: ({ row }) => {
      return (
        <CustomTooltip title={row.original.comment}>
          <div className="text-sm truncate max-w-[200px]">
            {row.original.comment}
          </div>
        </CustomTooltip>
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
          <StatusBadge status={row.original.leave?.status} />
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "actionDate",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Action Date & Time" />
    ),
    cell: ({ row }) => (
      <div className="text-sm capitalize">
        {moment(row.original.actionDate).format("DD/MM/YYYY h:mm A")}
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
];

export default leaveApprovalColumns;
