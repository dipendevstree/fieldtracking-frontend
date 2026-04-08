import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { DataTableRowActions } from "./table-action-button";
import { format } from "date-fns";
import StatusBadge from "@/components/ui/status-badge";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "organizationName",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Organization" />
    ),
    cell: ({ row }) => {
      const orgName = row.original.organizationName;
      const empRange = row.original.employeeRang?.employeeRange ?? "-";
      const adminData = row.original.adminData;
      const isSelfRegister = adminData?.active_token === null;

      return (
        <div className="font-medium">
          <div>{orgName}</div>
          <div className="text-muted-foreground text-xs">{empRange}</div>
          <StatusBadge
            status={
              isSelfRegister ? "register_via_app" : "created_via_super_admin"
            }
            className="mt-1"
            showDot={false}
          />
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      let status = row.original.isActive ? "active" : "inactive";

      return <StatusBadge status={status} />;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "adminUserId",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Admin Contact" />
    ),
    cell: ({ row }) => {
      const admin = row.original.adminData;
      return (
        <div>
          <div className="font-semibold">
            {admin?.firstName} {admin?.lastName}
          </div>
          <div className="text-muted-foreground text-xs">{admin?.email}</div>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "adminData.status",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Admin Status" />
    ),
    cell: ({ row }) => (
      <StatusBadge status={row.original.adminData?.status || "-"} />
    ),
    enableHiding: false,
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
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "userCount",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Users" />
    ),
    cell: ({ row }) => <div>{row.original.userCount ?? 0}</div>,
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const rawDate = row.original.createdDate;
      const formattedDate = format(rawDate, "dd-MM-yyyy");
      return <div>{formattedDate}</div>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "planStatus",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Plan Status" />
    ),
    cell: ({ row }) => {
      return <StatusBadge status={row.original.planStatus ?? "-"} />;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
