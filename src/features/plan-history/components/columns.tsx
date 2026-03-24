import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { format } from "date-fns";
import StatusBadge from "@/components/ui/status-badge";
import { PlanHistory } from "../type/type";
import { formatDropDownLabel } from "@/utils/commonFunction";

export const columns: ColumnDef<PlanHistory>[] = [
  {
    accessorKey: "plan.name",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Plan Name" />
    ),
    cell: ({ row }) => {
      const planName = row.original.plan?.name || row.original.planType || "-";
      return <div className="text-sm font-medium">{planName}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "planStartDate",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.planStartDate;
      return (
        <div className="text-sm">
          {date ? format(new Date(date), "dd-MM-yyyy") : "-"}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "planEndDate",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.planEndDate;
      return (
        <div className="text-sm">
          {date ? format(new Date(date), "dd-MM-yyyy") : "-"}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "activatedDate",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Activated Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.activatedDate;
      return (
        <div className="text-sm">
          {date ? format(new Date(date), "dd-MM-yyyy") : "-"}
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
      const status = row.original.status || "-";
      return <StatusBadge status={status} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "frequency",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Frequency" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {formatDropDownLabel(row.original.frequency ?? "") || "-"}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "pricePerUser",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Price/User" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.original.pricePerUser || "0"}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "gstPercent",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="GST %" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.original.gstPercent || "0"}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "baseAmount",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Base Amount" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.original.baseAmount || "0"}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "gstAmount",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="GST Amount" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.original.gstAmount || "0"}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "totalUser",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Users" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.original.totalUser || 0}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.original.totalAmount || "0"}
      </div>
    ),
    enableSorting: false,
  },
];
