import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { HolidayTypeRowActions } from "./table-action-button";
import { format } from "date-fns";

export const holidayTypeColumns: ColumnDef<any>[] = [
  {
    accessorKey: "holidayTypeName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Holiday Type Name" />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Created Date" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt || row.original.createdDate;

      const formattedDate = createdAt
        ? format(new Date(createdAt), "dd-MM-yyyy")
        : "-";

      return <div className=" text-sm">{formattedDate}</div>;
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <HolidayTypeRowActions row={row} />,
  },
];

export default holidayTypeColumns;
