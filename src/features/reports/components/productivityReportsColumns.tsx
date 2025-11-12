import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "@/components/shared/common-status-badge";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import LongText from "@/components/long-text";
import { ProductivityReportRow } from "../types";

export const ProductivityReportsColumns: ColumnDef<ProductivityReportRow>[] = [
  {
    header: "Sales Rep",
    accessorKey: "salesRepresentative",
    cell: ({ row }) => row.original.salesRepresentative || "-",
  },
  {
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Date" />
    ),
    accessorKey: "date",
    enableSorting: false,
  },
  {
    header: "Punch In",
    accessorKey: "punchIn",
    cell: ({ row }) => row.original.punchIn || "-",
  },
  {
    header: "Punch Out",
    accessorKey: "punchOut",
    cell: ({ row }) => row.original.punchOut || "-",
  },
  {
    header: "Working Hours",
    accessorKey: "workingHours",
    cell: ({ row }) => row.original.workingHours || "-",
  },
  {
    header: "Vehicle Type",
    accessorKey: "vehicleType",
    cell: ({ row }) => row.original.vehicleType || "-",
  },
  {
    header: "Vehicle Category",
    accessorKey: "vehicleCategory",
    cell: ({ row }) => row.original.vehicleCategory || "-",
  },
  {
    header: "Odometer",
    accessorKey: "odometer",
    cell: ({ row }) => row.original.odometer || "-",
  },
  {
    header: "Travel Distance",
    accessorKey: "totalDistance",
    cell: ({ row }) => row.original.totalDistance || "-",
  },
  {
    header: "Start Address",
    accessorKey: "dayStartAddress",
    cell: ({ row }) => (
      <LongText className="max-w-[200px]">
        {row.original.dayStartAddress || "-"}
      </LongText>
    ),
  },
  {
    header: "End Address",
    accessorKey: "dayEndAddress",
    cell: ({ row }) => (
      <LongText className="max-w-[200px]">
        {row.original.dayEndAddress || "-"}
      </LongText>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadge status={row.original.status as any} />,
  },
  {
    header: "Is On Break",
    accessorKey: "isOnBreak",
    cell: ({ row }) => row.original.isOnBreak || "-",
  },
  {
    header: "Break Time",
    accessorKey: "totalBreakTime",
    cell: ({ row }) => row.original.totalBreakTime || "-",
  },
];
