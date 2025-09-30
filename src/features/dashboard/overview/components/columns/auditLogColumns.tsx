import { formatName, getFullName } from "@/utils/commonFunction";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { formatAuditChanges } from "../../data/helperFunction";
import LongText from "@/components/long-text";
import StatusBadge from "@/components/shared/common-status-badge";

export const auditLogColumns: ColumnDef<any>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original?.user?.firstName
          ? formatName(
              getFullName(
                row.original?.user?.firstName,
                row.original?.user?.lastName
              )
            )
          : "System"}
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="font-medium">{formatName(row.original.action)}</div>
    ),
  },

  {
    accessorKey: "entity",
    header: "Entity",
    cell: ({ row }) => (
      <div className="font-medium">{formatName(row.original.entity)}</div>
    ),
  },

  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => (
      <div>{format(row.original.timestamp, "dd-MM-yyyy, hh:mm a")}</div>
    ),
  },
  {
    accessorKey: "resource",
    header: "Resource",
    cell: ({ row }) => (
      <LongText className="text-sm max-w-sm">
        {formatAuditChanges(
          row.original.oldValue,
          row.original.newValue,
          row.original.action,
          row.original.entity
        )}
      </LongText>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status.toLowerCase()} />
    ),
  },
];
