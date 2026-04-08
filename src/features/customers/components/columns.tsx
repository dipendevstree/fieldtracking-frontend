import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { DataTableRowActions } from "./table-action-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface CustomerContacts {
  customerName: string;
  email: string;
  designation: string;
  phoneNumber: string;
  isPrimary: boolean;
}
interface Customer {
  CustomerName: string;
  employeeRang?: {
    employeeRange: string;
  };
  adminData?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  industry?: {
    industryName: string;
  };
  companyName: string;
  isActive: boolean;
  createdDate: string;
  customerType?: {
    typeName: string;
  };
  location: string;
  assignedRep: string;
  contactPerson: string;
  phoneNumber: string;
  customerId: string;
  streetAddress: string;
  customerContacts: Array<CustomerContacts>;
}

interface GetColumnsProps {
  onEdit?: (id: string) => void;
}

export const getColumns = ({
  onEdit,
}: GetColumnsProps): ColumnDef<Customer>[] => [
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Company Name" />
    ),
    cell: ({ row }) => <div>{row.original.companyName ?? "-"}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "industry.industryName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Industry" />
    ),
    cell: ({ row }) => {
      return <div>{row.original.industry?.industryName ?? "-"}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "customerType.typeName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Customer Type" />
    ),
    cell: ({ row }) => <div>{row.original.customerType?.typeName ?? "-"}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "streetAddress",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const address = row.original.streetAddress ?? "-";
      if (address === "-") return <div>-</div>;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-[200px] truncate cursor-help">{address}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-[300px] text-sm">{address}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "customerContacts.customerName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Customer Name" />
    ),
    cell: ({ row }) => {
      const primaryContact = row.original.customerContacts.find(
        (c: CustomerContacts) => c.isPrimary,
      );
      return primaryContact ? (
        <div>{primaryContact.customerName ?? "-"}</div>
      ) : (
        <div>-</div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "customerContacts.email",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Customer Email" />
    ),
    cell: ({ row }) => {
      const primaryContact = row.original.customerContacts.find(
        (c: CustomerContacts) => c.isPrimary,
      );
      return primaryContact ? (
        <div>{primaryContact.email ?? "-"}</div>
      ) : (
        <div>-</div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "customerContacts.phoneNumber",
    header: ({ column }) => (
      <CustomDataTableColumnHeader
        column={column}
        title="Customer Contact Number"
      />
    ),
    cell: ({ row }) => {
      const primaryContact = row.original.customerContacts.find(
        (c: CustomerContacts) => c.isPrimary,
      );
      return primaryContact ? (
        <div>{primaryContact.phoneNumber ?? "-"}</div>
      ) : (
        <div>-</div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "customerContacts.designation",
    header: ({ column }) => (
      <CustomDataTableColumnHeader
        column={column}
        title="Customer Designation"
      />
    ),
    cell: ({ row }) => {
      const primaryContact = row.original.customerContacts.find(
        (c: CustomerContacts) => c.isPrimary,
      );
      return primaryContact ? (
        <div>{primaryContact.designation ?? "-"}</div>
      ) : (
        <div>-</div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <DataTableRowActions
        row={row as any}
        onEdit={onEdit ? () => onEdit(row.original.customerId) : undefined}
      />
    ),
  },
];
