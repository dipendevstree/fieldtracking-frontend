import { ColumnDef } from "@tanstack/react-table";

const truncateLocation = (location: string, maxLength: number = 50) => {
  if (!location) return "N/A";
  if (location.length <= maxLength) return location;
  return location.substring(0, maxLength) + "...";
};

export const customerColumns: ColumnDef<unknown>[] = [
  {
    accessorKey: "companyName",
    header: "Company Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {(row.original as any).companyName ||
          (row.original as any).CustomerName ||
          "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "customerType.typeName",
    header: "Customer Type",
    cell: ({ row }) => (
      <div>{(row.original as any).customerType?.typeName || "N/A"}</div>
    ),
  },
  {
    accessorKey: "streetAddress",
    header: "Location",
    cell: ({ row }) => (
      <div
        title={
          (row.original as any).streetAddress ||
          (row.original as any).adminName ||
          "N/A"
        }
      >
        {truncateLocation(
          (row.original as any).streetAddress ||
            (row.original as any).adminName ||
            "N/A"
        )}
      </div>
    ),
  },
  {
    accessorKey: "industry.industryName",
    header: "Industry",
    cell: ({ row }) => (
      <div>{(row.original as any).industry?.industryName || "N/A"}</div>
    ),
  },
];
