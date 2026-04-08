import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import StatusBadge from "@/components/ui/status-badge";
export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "user",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const firstName =
        row.original.firstName || row.original.adminData?.firstName;
      const lastName =
        row.original.lastName || row.original.adminData?.lastName;
      const organization =
        row.original.organizationName || row.original.organization;
      return (
        <div className="font-medium">
          <div>
            {firstName} {lastName}
          </div>
          <div className="text-muted-foreground text-xs">
            {organization.name || organization}
          </div>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Email Id" />
    ),
    cell: ({ row }) => {
      const email = row.original.email || row.original.adminData?.email;
      return <div className="text-sm">{email}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Number" />
    ),
    cell: ({ row }) => {
      const phone =
        row.original.phoneNumber || row.original.adminData?.phoneNumber;
      const countryCode = row.original.countryCode || "+1";
      return (
        <div className="text-sm">{phone ? `${countryCode} ${phone}` : "-"}</div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.original.role.roleName || "-";
      return (
        <div className="text-sm">
          {role.charAt(0).toUpperCase() + role.slice(1)}
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
    cell: ({ row }) => (
      <StatusBadge status={row.original?.status || "-"} />
    ),
    enableSorting: false,
  },
];
