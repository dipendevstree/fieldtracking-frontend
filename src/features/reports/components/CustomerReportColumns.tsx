import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import LongText from "@/components/long-text";
import { CustomerReportRow } from "../types";

export const CustomerReportColumns: ColumnDef<CustomerReportRow>[] = [
  {
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Customer Name" />
    ),
    accessorKey: "customerName",
    cell: ({ row }) => row.original.customerName || "-",
    enableSorting: false,
  },
  {
    header: "Address",
    accessorKey: "streetAddress",
    cell: ({ row }) => (
      <LongText className="max-w-[250px]">
        {row.original.streetAddress || "-"}
      </LongText>
    ),
  },
  {
    header: "Phone",
    accessorKey: "phoneNumber",
    cell: ({ row }) => row.original.phoneNumber || "-",
  },
  {
    header: "Total Visits Scheduled",
    accessorKey: "totalVisitScheduled",
    cell: ({ row }) => row.original.totalVisitScheduled || "0",
  },
  {
    header: "Visits Completed",
    accessorKey: "visitsCompleted",
    cell: ({ row }) => row.original.visitsCompleted || "0",
  },
  {
    header: "Pending Visits",
    accessorKey: "pendingVisits",
    cell: ({ row }) => row.original.pendingVisits || "0",
  },
  {
    header: "Completion Rate",
    accessorKey: "completionRate",
    cell: ({ row }) => row.original.completionRate || "0%",
  },
  {
    header: "Total Visit Duration (min)",
    accessorKey: "totalVisitDuration",
    cell: ({ row }) => row.original.totalVisitDuration || "0",
  },
  {
    header: "Cancelled Visits",
    accessorKey: "cancelledVisits",
    cell: ({ row }) => row.original.cancelledVisits || "0",
  },
  {
    header: "Rescheduled Visits",
    accessorKey: "rescheduledVisits",
    cell: ({ row }) => row.original.rescheduledVisits || "0",
  },
  {
    header: "Notes",
    accessorKey: "additionalNotes",
    cell: ({ row }) => (
      <LongText className="max-w-[200px]">
        {row.original.additionalNotes || "-"}
      </LongText>
    ),
  },
];
