import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import StatusBadge from "@/components/shared/common-status-badge";
import moment from "moment";
import CustomTooltip from "@/components/shared/custom-tooltip";

export function LeaveBalanceDiv({
  row,
  columnName,
}: {
  row: any;
  columnName: string;
}) {
  return (
    <div className="text-sm">
      <div>
        Total:{" "}
        {row.original[columnName].carryForward
          ? `${row.original[columnName].earned + row.original[columnName].carryForward} (Earned: ${row.original[columnName].earned} and Carry Forward: ${row.original[columnName].carryForward})`
          : `${row.original[columnName].earned}`}
      </div>
      <div>Taken: {row.original[columnName].used}</div>
      <div>Remaining: {row.original[columnName].remaining}</div>
    </div>
  );
}

export const leaveBalanceHistoryColumns: ColumnDef<any>[] = [
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="User Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm ">
          {row.original.userData?.firstName +
            " " +
            row.original.userData?.lastName}{" "}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "leaveTypeData.name",
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
  {
    accessorKey: "transactionType",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Transaction Type" />
    ),
    cell: ({ row }) => (
      <div>
        <StatusBadge
          status={
            row.original.transactionType.toLowerCase() === "add"
              ? "credit"
              : "debit"
          }
        />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Amount" />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "reason",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Comment" />
    ),
    cell: ({ row }) => {
      return (
        <CustomTooltip title={row.original.reason}>
          <div className="text-sm truncate max-w-[200px]">
            {row.original.reason}
          </div>
        </CustomTooltip>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "oldBalance",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Old Balance" />
    ),
    cell: ({ row }) => <LeaveBalanceDiv row={row} columnName="oldData" />,
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "newBalance",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="New Balance" />
    ),
    cell: ({ row }) => <LeaveBalanceDiv row={row} columnName="newData" />,
    enableHiding: false,
    enableSorting: false,
  },
];

export default leaveBalanceHistoryColumns;
