import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTableColumnHeader } from "@/components/shared/custom-table-header-column";
import { Edit, Trash2 } from "lucide-react";
import { ExpenseLimit } from "../type/type";
import { Badge } from "@/components/ui/badge";

// Expense Limit Columns
export const getExpenseLimitColumns = (
  onEdit: (limit: ExpenseLimit) => void,
  onDelete: (limit: ExpenseLimit) => void
): ColumnDef<ExpenseLimit>[] => [
  {
    accessorKey: "tierKey",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Tier" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.tierKey
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "expenseCategoryId",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      console.log("row.original.categoryName", row.original);

      return (
        <div className="font-medium">
          {row.original?.expenseCategory?.categoryName}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "dailyLimit",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Daily Limit" />
    ),
    cell: ({ row }) => (
      <div className="text">{row.original.dailyLimit.toLocaleString()}</div>
    ),
    meta: {
      className: "text",
    },
    enableSorting: false,
  },
  {
    accessorKey: "monthlyLimit",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Monthly Limit" />
    ),
    cell: ({ row }) => (
      <div className="text">{row.original.monthlyLimit.toLocaleString()}</div>
    ),
    meta: {
      className: "text",
    },
    enableSorting: false,
  },

  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
          onClick={() => onEdit(row.original)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onEdit(row.original);
            }
          }}
        >
          <Edit className="h-4 w-4 text-green-600" />
        </div>
        <div
          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
          onClick={() => onDelete(row.original)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onDelete(row.original);
            }
          }}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </div>
      </div>
    ),
    enableSorting: false,
  },
];
