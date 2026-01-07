import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import StatusBadge from "@/components/shared/common-status-badge";
import { format } from "date-fns";
import { Info } from "lucide-react";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { DataTableRowActions } from "./table-action-button";

export const createColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "employee",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Employee" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      const firstName = user?.firstName || "";
      const lastName = user?.lastName || "";
      const fullName =
        firstName || lastName ? `${firstName} ${lastName}`.trim() : "-";

      return (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{fullName}</span>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.attendance?.date;
      return (
        <div className="text-sm">
          {date ? format(new Date(date), "dd/MM/yyyy") : "-"}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "currentTime",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Current Time" />
    ),
    cell: ({ row }) => {
      const checkIn = row.original.attendance?.firstCheckIn;
      const checkOut = row.original.attendance?.lastCheckOut;
      const checkInTime = checkIn ? format(new Date(checkIn), "HH:mm") : "-";
      const checkOutTime = checkOut ? format(new Date(checkOut), "HH:mm") : "-";
      return (
        <div className="text-sm">
          {checkInTime} - {checkOutTime}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "requestedTime",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Requested Time" />
    ),
    cell: ({ row }) => {
      const checkIn = row.original.requestedCheckIn;
      const checkOut = row.original.requestedCheckOut;
      const checkInTime = checkIn ? format(new Date(checkIn), "HH:mm ") : "-";
      const checkOutTime = checkOut ? format(new Date(checkOut), "HH:mm") : "-";
      return (
        <div className="text-sm">
          {checkInTime} - {checkOutTime}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "reason",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Reason" />
    ),
    cell: ({ row }) => {
      return (
        <div
          className="text-sm max-w-[200px] truncate"
          title={row.original.reason}
        >
          {row.original.reason || "-"}
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
    accessorKey: "createdDate",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Requested Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.createdDate;
      return (
        <div className="text-sm">
          {date ? format(new Date(date), "dd/MM/yyyy HH:mm") : "-"}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const isPending = row?.original?.status === "PENDING";
      if (!isPending) {
        return (
          <div className="pl-2">
            <CustomTooltip title="Only pending corrections can be managed">
              <Info size={16} />
            </CustomTooltip>
          </div>
        );
      }

      return <DataTableRowActions row={row} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
