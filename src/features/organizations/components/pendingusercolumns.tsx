import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { DataTableRowActions } from "./PendingUser-table-action-button";
import LongText from "@/components/long-text";
import { format } from "date-fns";
import StatusBadge from "@/components/ui/status-badge";

export const pendingusercolumns: ColumnDef<any>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Admin Details" />
    ),
    cell: ({ row }) => {
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;
      const jobTitle = row.original.jobTitle;
      const initials = `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
      const isSelfRegister = row.original.active_token === null;
      // const userID = row.original.id;

      return (
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
            {initials}
          </div>
          <div>
            <div className="font-semibold">
              {firstName} {lastName}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">{jobTitle}</div>
            <StatusBadge
              status={
                isSelfRegister ? "register_via_app" : "created_via_super_admin"
              }
              className="mt-1"
              showDot={false}
            />
            {/* <div className="text-muted-foreground text-xs">{userID}</div> */}
          </div>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "organization.name",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Organization" />
    ),
    cell: ({ row }) => {
      const orgName = row.original.organization?.name;
      const website = row.original.organization?.website;
      const address = row.original.organization?.address;
      const city = row.original.organization?.city;

      return (
        <LongText className="max-w-sm">
          <div className="font-medium">{orgName}</div>
          {website && (
            <div className="text-muted-foreground text-xs">{website}</div>
          )}
          {address && city && (
            <div className="text-muted-foreground text-xs">
              {address}, {city}
            </div>
          )}
        </LongText>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Contact Info" />
    ),
    cell: ({ row }) => {
      const email = row.original.email;
      const phoneNumber = row.original.phoneNumber;
      const countryCode = row.original.countryCode;

      return (
        <div>
          <div className="font-medium">{email}</div>
          <div className="text-muted-foreground text-xs">
            {countryCode} {phoneNumber}
          </div>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Registration Info" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      const updatedAt = row.original.updated_at;
      const formattedCreated = format(new Date(createdAt), "dd-MM-yyyy");
      const formattedTime = format(new Date(createdAt), "hh:mm a");
      const formattedUpdated = format(new Date(updatedAt), "dd-MM-yyyy");

      return (
        <div>
          <div className="text-sm">
            {formattedCreated}, {formattedTime}
          </div>
          <div className="text-muted-foreground text-xs">
            Updated: {formattedUpdated}
          </div>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      const hasActiveToken = row.original.active_token !== null;

      return (
        <div className="space-y-1">
          <Badge
            variant={
              status === "pending"
                ? "secondary"
                : status === "rejected"
                  ? "destructive"
                  : "default"
            }
            className={
              status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
            }
          >
            {status}
          </Badge>
          {hasActiveToken && (
            <div className="text-muted-foreground text-xs">Token Active</div>
          )}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "role.roleName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const roleName = row.original.role?.roleName;

      return (
        <Badge variant="outline" className="capitalize">
          {roleName}
        </Badge>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
