import { Link } from "@tanstack/react-router";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { CircleCheck, CircleX, ClipboardCheck, Eye } from "lucide-react";
import Button from "@/components/shared/custom-button";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { userUpcomingVisitStoreState } from "@/features/approvals/store/upcoming-visits.store";
import { EXPENSE_STATUS } from "@/data/app.data";

type RowProps = {
  row: {
    original: {
      visitId: string;
      purpose?: string;
      [key: string]: any;
    };
  };
};

export function DataTableRowActions({ row }: RowProps) {
  const { setOpen, setCurrentRow } = userUpcomingVisitStoreState();

  const handleActionOnExpense = (actionType: EXPENSE_STATUS) => {
    setCurrentRow({ ...row.original, actionType });
    setOpen("action");
    console.log("render, open and action type", actionType)
  }

  return (
    <div className="flex items-center space-x-2">
      <PermissionGate requiredPermission="daily_expense" action="viewGlobal">
        <CustomTooltip title="View">
          <Link to="/approvals/daily-expense-details/$id" params={{ id: row.original.id }} className="h-8 w-8 p-2 text-orange-500">
            <Eye size={16} />
          </Link>
        </CustomTooltip>
      </PermissionGate>
      {(row?.original?.isApprovalLevel && !row?.original?.updateAction) && (
        <>
          {(row?.original?.showApprove && !row?.original?.updateAction) ? (
            <PermissionGate requiredPermission="daily_expense" action="viewGlobal">
              <CustomTooltip title={`${row?.original?.updateAction ? "Update ": ""}Approve`}>
                <Button variant="ghost" className="h-8 w-8 p-0 text-green-500" onClick={() => handleActionOnExpense(EXPENSE_STATUS.APPROVED)}>
                  <ClipboardCheck size={16} />
                </Button>
              </CustomTooltip>
            </PermissionGate>
          ): (
            <PermissionGate requiredPermission="daily_expense" action="viewGlobal">
              <CustomTooltip title={`${row?.original?.updateAction ? "Update ": ""}Review`}>
                <Button variant="ghost" className="h-8 w-8 p-0 text-green-500" onClick={() => handleActionOnExpense(EXPENSE_STATUS.REVIEWED)}>
                  <CircleCheck size={16} />
                </Button>
              </CustomTooltip>
            </PermissionGate>
          )}
          {!row?.original?.updateAction && (
            <PermissionGate requiredPermission="daily_expense" action="viewGlobal">
              <CustomTooltip title="Reject">
                <Button variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleActionOnExpense(EXPENSE_STATUS.REJECT)}>
                  <CircleX size={16} />
                </Button>
              </CustomTooltip>
            </PermissionGate>
          )}
        </>
      )}

      {/* {currentRow && (
        <DeleteModal
          key="delete-daily-expense"
          open={open === "delete"}
          currentRow={currentRow ?? {}}
          itemName="Daily Expense"
          itemIdentifier={"purpose" as keyof typeof currentRow}
          onDelete={handleDeleteDailyExpense}
          onOpenChange={(value) => {
            if (!value) closeModal();
            else setOpen("delete");
          }}
        />
      )} */}
    </div>
  );
}
