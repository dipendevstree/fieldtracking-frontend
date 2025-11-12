import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import StatusBadge from "@/components/shared/common-status-badge";
import LongText from "@/components/long-text";
import { VisitReportRow } from "../types";
import { Badge } from "@/components/ui/badge";

const getPriorityBadge = (priority: string) => {
  const variants: Record<string, string> = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };
  return variants[priority] || "bg-gray-100 text-gray-800";
};

export const VisitReportColumns: ColumnDef<VisitReportRow>[] = [
  {
    header: "Sales Rep",
    accessorKey: "salesRepresentativeUserName",
    cell: ({ row }) => row.original.salesRepresentativeUserName || "-",
  },
  {
    header: "Customer",
    accessorKey: "customerName",
    cell: ({ row }) => row.original.customerName || "-",
  },
  {
    header: "Priority",
    accessorKey: "priority",
    cell: ({ row }) => (
      <Badge className={getPriorityBadge(row.original.priority || "")}>
        {row.original.priority || "-"}
      </Badge>
    ),
  },
  {
    header: "Purpose",
    accessorKey: "purpose",
    cell: ({ row }) => (
      <LongText className="max-w-[200px]">
        {row.original.purpose || "-"}
      </LongText>
    ),
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
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Date" />
    ),
    accessorKey: "date",
    enableSorting: false,
  },
  {
    header: "Check In",
    accessorKey: "visitCheckInTime",
    cell: ({ row }) => row.original.visitCheckInTime || "-",
  },
  {
    header: "Check Out",
    accessorKey: "visitCheckOutTime",
    cell: ({ row }) => row.original.visitCheckOutTime || "-",
  },
  {
    header: "Duration",
    accessorKey: "duration",
    cell: ({ row }) => row.original.duration || "-",
  },
  {
    header: "Meeting Notes",
    accessorKey: "meetingNotes",
    cell: ({ row }) => (
      <LongText className="max-w-[200px]">
        {row.original.meetingNotes || "-"}
      </LongText>
    ),
  },
  {
    header: "Meeting Outcomes",
    accessorKey: "meetingOutcomes",
    cell: ({ row }) => (
      <LongText className="max-w-[200px]">
        {row.original.meetingOutcomes || "-"}
      </LongText>
    ),
  },
  {
    header: "Follow-Up Date",
    accessorKey: "followUpDate",
    cell: ({ row }) => row.original.followUpDate || "-",
  },
  {
    header: "Next Actions",
    accessorKey: "nextActions",
    cell: ({ row }) => (
      <LongText className="max-w-[200px]">
        {row.original.nextActions || "-"}
      </LongText>
    ),
  },
  {
    header: "Feedback (★)",
    accessorKey: "feedBackStar",
    cell: ({ row }) => row.original.feedBackStar || "-",
  },
  {
    header: "Feedback Description",
    accessorKey: "feedBackDescription",
    cell: ({ row }) => (
      <LongText className="max-w-[200px]">
        {row.original.feedBackDescription || "-"}
      </LongText>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadge status={row.original.status as any} />,
  },
];
