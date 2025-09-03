import { useEffect } from "react";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import {
  useCreateExpenseLimit,
  useUpdateExpenseLimit,
  useDeleteExpenseLimit,
  ExpenseLimitPayload,
} from "../services/LImits&Controlshook";
import { useLimitsControlsStore } from "../store/limits-&-controls.store";
import { ExpenseLimitActionForm } from "./action-form";
import { TExpenseLimitFormSchema } from "../data/schema";
import { useGetExpenseCategoriesData } from "../../Expense-categories/services/expense-categories.hook";
import { toast } from "sonner";

export function LimitsControlsActionModal() {
  const { open, setOpen, currentLimit, setCurrentLimit } =
    useLimitsControlsStore();

  // Debug logging
  console.log("LimitsControlsActionModal - open:", open);
  console.log("LimitsControlsActionModal - currentLimit:", currentLimit);

  // Fetch expense categories for the form
  const {
    expenseCategories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetExpenseCategoriesData({
    page: 1,
    limit: 100, // Load more categories at once
    searchFor: "", // No search filter
  });

  // Debug logging for categories
  console.log("Expense categories loaded:", expenseCategories);
  console.log("Categories loading:", categoriesLoading);
  console.log("Categories error:", categoriesError);

  // Expense Limit hooks
  const {
    mutate: createExpenseLimit,
    isPending: isCreateLimitLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateExpenseLimit();

  const {
    mutate: updateExpenseLimit,
    isPending: isUpdateLimitLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateExpenseLimit(currentLimit?.limitId || "");

  const {
    mutate: deleteExpenseLimit,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
  } = useDeleteExpenseLimit(currentLimit?.limitId || "");

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
    setTimeout(() => {
      setCurrentLimit(null);
    }, 300);
  };

  // Expense Limit handlers
  const handleCreateExpenseLimit = (values: TExpenseLimitFormSchema) => {
    if (!values.expenseCategoryId) {
      toast.error("Please select an expense category");
      return;
    }

    const payload: ExpenseLimitPayload = {
      tierKey: values.tierkey.trim(),
      expenseCategoryId: values.expenseCategoryId.trim(),
      dailyLimit: values.dailyLimit,
      monthlyLimit: values.monthlyLimit,
      isActive: values.isActive,
    };

    createExpenseLimit(payload);
  };

  const handleUpdateExpenseLimit = (values: TExpenseLimitFormSchema) => {
    if (!currentLimit?.limitId) {
      toast.error("Unable to update: Expense limit not found");
      return;
    }

    if (!values.expenseCategoryId) {
      toast.error("Please select an expense category");
      return;
    }

    const payload: ExpenseLimitPayload = {
      tierKey: values.tierkey.trim(),
      expenseCategoryId: values.expenseCategoryId.trim(),
      dailyLimit: values.dailyLimit,
      monthlyLimit: values.monthlyLimit,
      isActive: values.isActive,
    };

    console.log("Update payload:", payload);
    console.log("Calling updateExpenseLimit with payload");
    updateExpenseLimit(payload);
  };

  const handleDeleteExpenseLimit = () => {
    if (!currentLimit?.limitId) {
      toast.error("Unable to delete: Expense limit not found");
      return;
    }

    deleteExpenseLimit();
  };

  return (
    <>
      {/* Expense Limit Modals */}
      <ExpenseLimitActionForm
        key="add-limit"
        open={open === "add-limit"}
        loading={isCreateLimitLoading}
        expenseCategories={expenseCategories}
        onSubmit={handleCreateExpenseLimit}
        onOpenChange={(value) => {
          if (!value) closeModal();
          else setOpen("add-limit");
        }}
      />

      {currentLimit && (
        <>
          <ExpenseLimitActionForm
            key={`edit-limit-${currentLimit.limitId}`}
            open={open === "edit-limit"}
            loading={isUpdateLimitLoading}
            currentLimit={currentLimit}
            expenseCategories={expenseCategories}
            onSubmit={handleUpdateExpenseLimit}
            onOpenChange={(value) => {
              if (!value) closeModal();
              else setOpen("edit-limit");
            }}
          />

          <DeleteModal
            key={`delete-limit-${currentLimit?.limitId}`}
            open={open === "delete-limit"}
            currentRow={currentLimit}
            itemIdentifier={"limitId" as keyof typeof currentLimit}
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
