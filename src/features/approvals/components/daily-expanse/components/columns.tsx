import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";

import StatusBadge from "@/components/shared/common-status-badge";
import {
  formatExpenseSubType,
  formatExpenseType,
} from "@/utils/commonFormatters";
import { DataTableRowActions } from "./daily-expense-table-action-button";
import { formatDateRange } from "@/utils/commonFunction";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";
import CustomTooltip from "@/components/shared/custom-tooltip";

export const createColumns = (
  selectedRows: Set<string>,
  toggleRowSelection: (rowId: string) => void,
  toggleSelectAll: () => void,
  isAllSelected: boolean
): ColumnDef<any>[] => [
  {
    accessorKey: "manageExpense",
    header: () => (
      <div>
        <Checkbox
          id="manage-all-expense"
          checked={isAllSelected}
          onCheckedChange={toggleSelectAll}
        />
        {/* <label htmlFor="manage-all-expense" className="text-sm pl-2">Select All</label> */}
      </div>
    ),
    cell: ({ row }) => {
      if (!row?.original?.isApprovalLevel) {
        return (
          <CustomTooltip title={row?.original?.warningMessageForAmount || "No further actions."}>
            <Info size={16}/>
          </CustomTooltip>
        )
      }
      const isSelected = selectedRows.has(String(row.original.id))
      return (
        <Checkbox
          id={`expense-${row.original.id}`}
          checked={isSelected}
          onCheckedChange={() => toggleRowSelection(String(row.original.id))}
          value={row.original.id}
        />
      )
    }
  },
  {
    accessorKey: "salesRep",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Sales Rep" />
    ),
    cell: ({ row }) => {
      const user = row.original.salesRepresentativeUser;
      const firstName = user?.firstName || "";
      const lastName = user?.lastName || "";
      const fullName =
        firstName || lastName ? `${firstName} ${lastName}`.trim() : "-";

      return (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{fullName}</span>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }:any) => {
      console.log("row", row);
      
     
      return <div className=" text-sm">{formatDateRange(row.original.startDate,row.original.endDate)}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Amount" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "expenseType",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Type" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const value = row.getValue("expenseType");
      return formatExpenseType(String(value));
    },
  },
  {
    accessorKey: "expenseSubType",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Sub Type" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const value = row.getValue("expenseSubType");
      return formatExpenseSubType(String(value));
    },
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
  },
];
