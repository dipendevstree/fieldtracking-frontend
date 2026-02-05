import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import StatusBadge from "@/components/shared/common-status-badge";
import moment from "moment";
import CustomTooltip from "@/components/shared/custom-tooltip";

export const leaveEncashmentApprovalHistoryColumns: ColumnDef<any>[] = [
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="User Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm ">
          {row.original.leaveEncashment?.user?.firstName +
            " " +
            row.original.leaveEncashment?.user?.lastName}{" "}
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
        {moment(row.original.leaveEncashment?.createdDate).format("DD/MM/YYYY")}
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="No of Days" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          {row.original.leaveEncashment?.daysEncashed}
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
          <StatusBadge status={row.original.leaveEncashment?.status} />
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

export default leaveEncashmentApprovalHistoryColumns;
