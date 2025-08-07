import { useNavigate } from "@tanstack/react-router";
import { IconTrash } from "@tabler/icons-react";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { BookCheckIcon } from "lucide-react";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import Button from "@/components/shared/custom-button";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { useDeleteVisits } from "../services/calendar-view.hook";
import { userUpcomingVisitStoreState } from "../store/upcoming-visits.store";

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
  const { open, setOpen, currentRow, setCurrentRow } =
    userUpcomingVisitStoreState();
  const navigate = useNavigate();

  const closeModal = () => {
    setOpen(null);
    setTimeout(() => setCurrentRow(null), 300);
  };

  const { mutate: deleteDailyExpense } = useDeleteVisits(
    row.original.visitId,
    closeModal
  );

  const handleView = () => {
    setCurrentRow(row.original);
    console.log("row.original", row.original);
    navigate({
      to: `daily-expense-details/${row.original.id}`,
      params: { id: row.original.id },
    });
  };

  const handleDelete = () => {
    setCurrentRow(row.original);
    setOpen("delete");
  };

  const handleDeleteDailyExpense = () => {
    if (currentRow?.visitId) {
      deleteDailyExpense();
    } else {
      closeModal();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <PermissionGate requiredPermission="daily_expense" action="viewGlobal">
        <CustomTooltip title="view">
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={handleView}>
            <BookCheckIcon size={16} />
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

      {currentRow && (
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
      )}
    </div>
  );
}
