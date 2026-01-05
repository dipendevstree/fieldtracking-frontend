import { ColumnDef } from "@tanstack/react-table";
import { HolidayListAction } from "./holiday-list-action";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { format } from "date-fns";

export const holidayListColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Holiday Name" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Holiday Date" />
    ),
    cell: ({ row }) => format(row.original.date, "dd-MM-yyyy"),
    enableSorting: false,
  },
  {
    accessorKey: "holidayType.holidayTypeName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Holiday Type" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "isSpecial",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Is Special" />
    ),
    cell: ({ row }) => {
      const isSpecial = row.original.isSpecial;
      return isSpecial ? "Yes" : "No";
    },
    enableSorting: false,
  },
  {
    accessorKey: "HolidayTemplates",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Holiday Templates" />
    ),
    cell: ({ row }) => {
      const holidayTemplates = row.original.HolidayTemplates;
      return holidayTemplates?.length > 0
        ? holidayTemplates
            ?.map((template: any) => template?.holidayTemplateName)
            .join(", ")
        : "No";
    },
    enableSorting: false,
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <HolidayListAction currentRow={row.original} />,
    enableSorting: false,
  },
];

export default holidayListColumns;
