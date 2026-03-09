import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { DataTableRowActions } from "./table-action-button";
import { format } from "date-fns";
import CustomTooltip from "@/components/shared/custom-tooltip";
import StatusBadge from "@/components/ui/status-badge";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "salesRap",
    header: ({ column }) => (
      <CustomDataTableColumnHeader
        column={column}
        title="Sales Representative"
      />
    ),
    cell: ({ row }) => {
      const user = row.original.salesRepresentativeUser;
      const firstName = user?.firstName || "";
      const lastName = user?.lastName || "";

      const territory =
        firstName || lastName ? `${firstName} ${lastName}`.trim() : "-";

      return <div className="text-sm font-medium">{territory}</div>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "Customer",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const companyName = row.original.customer?.companyName || "";
      return <div className="text-sm">{companyName}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "Priority",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.original.priority || "";
      return <StatusBadge status={priority} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }) => {
      const date = row.original.date;
      const time = row.original.time;

      const formattedDate = date ? format(new Date(date), "dd-MM-yyyy") : "";

      const dateAndTime =
        formattedDate && time
          ? `${formattedDate}, ${time}`
          : formattedDate || time || "-";

      return <div className="text-sm">{dateAndTime}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "purpose",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Purpose" />
    ),
    cell: ({ row }) => {
      const purpose = row.original.purpose || "";
      return <div className="text-sm">{purpose}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const streetAddress = row.original.streetAddress || "";
      return (
        <CustomTooltip title={streetAddress}>
          <div
            className=" max-w-[200px] cursor-default truncate text-sm"
            title={streetAddress}
          >
            {streetAddress}
          </div>
        </CustomTooltip>
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
      const status = row.original.status || "";
      return <StatusBadge status={status} />;
    },
    enableSorting: false,
  },

  {
    id: "actions",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
  },
];
