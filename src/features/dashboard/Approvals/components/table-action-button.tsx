import { useNavigate } from "@tanstack/react-router";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { EyeIcon } from "lucide-react";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import Button from "@/components/shared/custom-button";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { useApprovalsStore } from "../store/approvals.store";

type RowProps = {
  row: {
    original: any;
  };
};

export function DataTableRowActions({ row }: RowProps) {
  const { open, setOpen, currentApproval, setCurrentApproval } =
    useApprovalsStore();
  const navigate = useNavigate();

  const closeModal = () => {
    setOpen(null);
    setTimeout(() => setCurrentApproval(null), 300);
  };

  const handleEdit = () => {
    setCurrentApproval(row.original);
    navigate({ to: `/calendar/schedule-visit/${row.original.id}` });
  };

  const handleView = () => {
    setCurrentApproval(row.original);
    navigate({
      to: `daily-expense-details/${row.original.id}`,
      params: { id: row.original.id },
    });
  };

  const handleDelete = () => {
    setCurrentApproval(row.original);
    setOpen("delete");
  };

  const handleDeleteDailyExpense = () => {
    if (currentApproval?.id) {
      // Add delete functionality here
      console.log("Deleting expense:", currentApproval.id);
    } else {
      closeModal();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <PermissionGate requiredPermission="upcoming_visits" action="edit">
        <CustomTooltip title="Edit">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
            onClick={handleEdit}
          >
            <IconEdit size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>
      <PermissionGate requiredPermission="daily_expense" action="viewGlobal">
        <CustomTooltip title="view">
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={handleView}>
            <EyeIcon size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>
      <PermissionGate requiredPermission="daily_expense" action="delete">
        <CustomTooltip title="Delete">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleDelete}
          >
            <IconTrash size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>

      {currentApproval && (
        <DeleteModal
          key="delete-daily-expense"
          open={open === "delete"}
          currentRow={currentApproval ?? {}}
          itemName="Daily Expense"
          itemIdentifier={"purpose" as keyof typeof currentApproval}
          onDelete={handleDeleteDailyExpense}
          onOpenChange={(value) => {
            if (!value) closeModal();
            else setOpen("delete");
          }}
        />
      )}
    </div>
  );
}
