import { useEffect } from "react";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import {
  useCreateExpenseLimit,
  useUpdateExpenseLimit,
  useDeleteExpenseLimit,
  ExpenseLimitPayload,
} from "../services/LImits&Controlshook";
import { useLimitsControlsStore } from "../store/limits-&-controls.store";
import { useExpenseCategoriesStore } from "../../Expense-categories/store/expense-categories.store";
import { useGetExpenseCategoriesData } from "../../Expense-categories/services/expense-categories.hook";
import { ExpenseLimitActionForm } from "./action-form";
import { TExpenseLimitFormSchema } from "../data/schema";
import { toast } from "sonner";

export function LimitsControlsActionModal() {
  const { open, setOpen, currentLimit, setCurrentLimit } =
    useLimitsControlsStore();
  const { expenseCategories, setExpenseCategories } =
    useExpenseCategoriesStore();

  // Helper function to get the correct ID field
  const getLimitId = (limit: any) => {
    return limit?.expenseLimitId || limit?.id || limit?.limitId || "";
  };

  // Fetch expense categories data
  const { expenseCategories: fetchedCategories } = useGetExpenseCategoriesData({
    limit: 100,
    page: 1,
    defaultCategory: true,
  });

  // Update store when data is fetched
  useEffect(() => {
    if (fetchedCategories && fetchedCategories.length > 0) {
      setExpenseCategories(fetchedCategories);
    }
  }, [fetchedCategories, setExpenseCategories]);

  const {
    mutate: createExpenseLimit,
    isPending: isCreateLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateExpenseLimit();

  const {
    mutate: updateExpenseLimit,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateExpenseLimit(getLimitId(currentLimit));

  const {
    mutate: deleteExpenseLimit,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
  } = useDeleteExpenseLimit(getLimitId(currentLimit));

  // Auto-close on successful create/update/delete
  useEffect(() => {
    if (
      (isCreateSuccess && !isCreateError) ||
      (isUpdateSuccess && !isUpdateError) ||
      (isDeleteSuccess && !isDeleteError)
    ) {
      closeModal();
    }
  }, [
    isCreateSuccess,
    isCreateError,
    isUpdateSuccess,
    isUpdateError,
    isDeleteSuccess,
    isDeleteError,
  ]);

  const closeModal = () => {
    setOpen(null);
    setTimeout(() => setCurrentLimit(null), 300);
  };

  const handleCreateExpenseLimit = (values: TExpenseLimitFormSchema) => {
    try {
      const payload: ExpenseLimitPayload = {
        tierKey: values.tierKey,
        expenseCategoryId: values.expenseCategoryId,
        dailyLimit: values.dailyLimit,
        monthlyLimit: values.monthlyLimit,
        isActive: values.isActive ?? true,
      };

      if (!payload.tierKey || !payload.expenseCategoryId) {
        console.error("Validation failed:", {
          tierKey: payload.tierKey,
          expenseCategoryId: payload.expenseCategoryId,
        });
        return;
      }

      createExpenseLimit(payload);
    } catch (error) {
      console.error("Error creating limit:", error);
    }
  };

  const handleUpdateExpenseLimit = (values: TExpenseLimitFormSchema) => {
    try {
      const limitId = getLimitId(currentLimit);
      if (!limitId) {
        console.error(
          "No limit ID found for update. Current limit:",
          currentLimit,
        );
        return;
      }

      const payload: ExpenseLimitPayload = {
        tierKey: values.tierKey,
        expenseCategoryId: values.expenseCategoryId,
        dailyLimit: values.dailyLimit,
        monthlyLimit: values.monthlyLimit,
        isActive: values.isActive ?? true,
      };

      if (!payload.tierKey || !payload.expenseCategoryId) {
        toast.error("Tier key and expense category are required");
        return;
      }

      updateExpenseLimit(payload);
    } catch (error) {
      console.error("Error updating limit:", error);
    }
  };

  const handleDeleteExpenseLimit = () => {
    try {
      const limitId = getLimitId(currentLimit);
      if (!limitId) {
        console.error("No limit ID found. Current limit:", currentLimit);
        return;
      }

      deleteExpenseLimit();
    } catch (error) {
      console.error("Error deleting limit:", error);
    }
  };

  return (
    <>
      {/* Add Modal */}
      <ExpenseLimitActionForm
        key="add-limit"
        open={open === "add-limit"}
        loading={isCreateLoading}
        expenseCategories={expenseCategories}
        onSubmit={handleCreateExpenseLimit}
        onOpenChange={(value) => {
          if (!value) closeModal();
          else setOpen("add-limit");
        }}
      />

      {/* Edit + Delete Modals */}
      {currentLimit && (
        <>
          <ExpenseLimitActionForm
            key="edit-limit"
            open={open === "edit-limit"}
            loading={isUpdateLoading}
            currentLimit={currentLimit}
            expenseCategories={expenseCategories}
            onSubmit={handleUpdateExpenseLimit}
            onOpenChange={(value) => {
              if (!value) closeModal();
              else setOpen("edit-limit");
            }}
          />

          <DeleteModal
            key="delete-limit"
            open={open === "delete-limit"}
            currentRow={currentLimit}
            itemIdentifier={"tierKey" as keyof typeof currentLimit}
            itemName="Expense Limit"
            onDelete={handleDeleteExpenseLimit}
            onOpenChange={(value) => {
              if (!value) closeModal();
              else setOpen("delete-limit");
            }}
          />
        </>
      )}
    </>
  );
}
