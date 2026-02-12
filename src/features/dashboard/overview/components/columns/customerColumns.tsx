import LongText from "@/components/long-text";
import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "../../type/type";

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "companyName",
    header: "Company Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.companyName ?? "-"}</div>
    ),
  },
  {
    accessorKey: "industry.industryName",
    header: "Industry",
    cell: ({ row }) => <div>{row.original.industry?.industryName ?? "-"}</div>,
  },
  {
    accessorKey: "customerType.typeName",
    header: "Customer Type",
    cell: ({ row }) => <div>{row.original.customerType?.typeName ?? "-"}</div>,
  },
  {
    accessorKey: "streetAddress",
    header: "Location",
    cell: ({ row }) => (
      <LongText className="max-w-[250px]">
        {row.original.streetAddress ?? "-"}
      </LongText>
    ),
  },
  {
    accessorKey: "customerContacts",
    header: "Customer Name",
    cell: ({ row }) => {
      const primary = row.original.customerContacts?.find((c) => c.isPrimary);
      return <div>{primary?.customerName ?? "-"}</div>;
    },
  },
  {
    header: "Customer Email",
    cell: ({ row }) => {
      const primary = row.original.customerContacts?.find((c) => c.isPrimary);
      return <div>{primary?.email ?? "-"}</div>;
    },
  },
  {
    header: "Customer Contact Number",
    cell: ({ row }) => {
      const primary = row.original.customerContacts?.find((c) => c.isPrimary);
      return <div>{primary?.phoneNumber ?? "-"}</div>;
    },
  },
  {
    header: "Customer Designation",
    cell: ({ row }) => {
      const primary = row.original.customerContacts?.find((c) => c.isPrimary);
      return <div>{primary?.designation ?? "-"}</div>;
    },
  },
];
