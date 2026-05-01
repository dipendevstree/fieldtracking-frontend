import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { ShiftRowActions } from "./table-action-button";
import {
  formatDropDownLabel,
  formatTimeTo12Hour,
} from "@/utils/commonFunction";
import { getShiftThresholdExpiryTime } from "@/features/attendance-management/utils/shift-time";

export const getShiftColumns = (totalCount: number): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Shift Name" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{formatDropDownLabel(row.original.name)}</div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Start Time" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {formatTimeTo12Hour(row.original.startTime)}
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="End Time" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{formatTimeTo12Hour(row.original.endTime)}</div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "fullDayHours",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Full Day Hours" />
    ),
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.fullDayHours} hrs</div>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "halfDayHours",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Half Day Hours" />
    ),
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.halfDayHours} hrs</div>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "breakMinutes",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Break Minutes" />
    ),
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.breakMinutes} min</div>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "thresholdMinutes",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Threshold" />
    ),
    cell: ({ row }) => {
      const value = row.original.thresholdMinutes;
      return <div className="text-sm">{Number(value ?? 0)} min</div>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "thresholdExpiryTime",
    header: ({ column }) => (
      <CustomDataTableColumnHeader
        column={column}
        title="Threshold Expiry Time"
      />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {getShiftThresholdExpiryTime(
          row.original.endTime,
          row.original.thresholdMinutes,
        )}
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "isDefault",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Default" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.isDefault ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Yes
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            No
          </span>
        )}
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <ShiftRowActions row={row} totalShifts={totalCount} />,
  },
];

export const shiftColumns = getShiftColumns(0); // Default export for backward compatibility
export default shiftColumns;
