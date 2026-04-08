import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { PendingLeaveEncashmentRowActions } from "./pending-leave-encashment-table-action-button";
import moment from "moment";
import StatusBadge from "@/components/ui/status-badge";

export const pendingLeaveEncashmentColumns = (
  hideUserColumn = false,
): ColumnDef<any>[] => [
  ...(!hideUserColumn
    ? [
        {
          accessorKey: "userName",
          header: ({ column }: { column: any }) => (
            <CustomDataTableColumnHeader column={column} title="User Name" />
          ),
          cell: ({ row }: { row: any }) => {
            return (
              <div className="text-sm ">
                {row.original.user ? row.original.user?.firstName +
                  " " +
                  row.original.user?.lastName : "Unknown User"}{" "}
              </div>
            );
          },
          enableHiding: false,
          enableSorting: false,
        },
      ]
    : []),
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="text-sm capitalize">
        {moment(row.original.createdDate).format("DD/MM/YYYY")}
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
      return <div className="text-sm">{row.original.daysEncashed}</div>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  ...(hideUserColumn
    ? [
        {
          accessorKey: "leaveEncashmentApprovals.comment",
          header: ({ column }: { column: any }) => (
            <CustomDataTableColumnHeader
              column={column}
              title="Reviewer's Comment"
            />
          ),
          cell: ({ row }: { row: any }) => {
            return (
              <div className="text-sm ">
                {row.original?.leaveEncashmentApprovals?.length
                  ? row.original?.leaveEncashmentApprovals?.[0]?.comment
                  : "-"}
              </div>
            );
          },
          enableHiding: false,
          enableSorting: false,
        },
      ]
    : []),
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
    accessorKey: "actions",
    header: ({ column }: { column: any }) => (
      <CustomDataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }: { row: any }) => (
      <PendingLeaveEncashmentRowActions row={row} />
    ),
    enableHiding: false,
    enableSorting: false,
  },
];

export default pendingLeaveEncashmentColumns;
