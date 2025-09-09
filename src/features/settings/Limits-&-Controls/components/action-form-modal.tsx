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
  const { open, setOpen, currentLimit, setCurrentLimit } = useLimitsControlsStore();
  const { expenseCategories, setExpenseCategories } = useExpenseCategoriesStore();
  
  // Debug: Log the current limit structure and find correct ID field
  useEffect(() => {
    if (currentLimit) {
      console.log('Current limit object:', currentLimit)
      console.log('Available fields in currentLimit:', Object.keys(currentLimit))
      console.log('expenseLimitId value:', currentLimit.expenseLimitId)
      // Check for alternative ID field names
      const altId = (currentLimit as any).id || (currentLimit as any).limitId
      console.log('Alternative ID value:', altId)
    }
  }, [currentLimit])
  
  // Helper function to get the correct ID field
  const getLimitId = (limit: any) => {
    return limit?.expenseLimitId || limit?.id || limit?.limitId || ''
  }
  
  // Fetch expense categories data
  const { expenseCategories: fetchedCategories } = useGetExpenseCategoriesData({
    limit: 100,
    page: 1,
    defaultCategory: true
  });

  // Update store when data is fetched
  useEffect(() => {
    console.log('Fetched categories from API:', fetchedCategories);
    if (fetchedCategories && fetchedCategories.length > 0) {
      console.log('Setting expense categories in store:', fetchedCategories);
      setExpenseCategories(fetchedCategories);
    }
  }, [fetchedCategories, setExpenseCategories]);
  
  // Debug current state
  useEffect(() => {
    console.log('Current expenseCategories in store:', expenseCategories);
  }, [expenseCategories]);
  const {
    mutate: createExpenseLimit,
    isPending: isCreateLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
    error: createError,
  } = useCreateExpenseLimit();
  
  // Debug API states
  useEffect(() => {
    console.log('Create API states:', {
      isCreateLoading,
      isCreateSuccess,
      isCreateError,
      createError
    });
  }, [isCreateLoading, isCreateSuccess, isCreateError, createError]);

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
    console.log('handleCreateExpenseLimit called with:', values);
    try {
      const payload: ExpenseLimitPayload = {
        tierKey: values.tierKey,
        expenseCategoryId: values.expenseCategoryId,
        dailyLimit: values.dailyLimit,
        monthlyLimit: values.monthlyLimit,
        isActive: values.isActive ?? true,
      };

      console.log('Created payload:', payload);

      if (!payload.tierKey || !payload.expenseCategoryId) {
        console.error('Validation failed:', { tierKey: payload.tierKey, expenseCategoryId: payload.expenseCategoryId });
        toast.error("Tier key and expense category are required");
        return;
      }

      console.log('Calling createExpenseLimit with payload:', payload);
      createExpenseLimit(payload);
    } catch (error) {
      console.error("Error creating limit:", error);
      toast.error("Failed to create limit");
    }
  };

  const handleUpdateExpenseLimit = (values: TExpenseLimitFormSchema) => {
    try {
      const limitId = getLimitId(currentLimit)
      if (!limitId) {
        console.error('No limit ID found for update. Current limit:', currentLimit)
        toast.error('Limit ID is missing. Please refresh and try again.')
        return
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

      console.log('Updating limit with ID:', limitId, 'Payload:', payload)
      updateExpenseLimit(payload);
    } catch (error) {
      console.error("Error updating limit:", error);
      toast.error("Failed to update limit");
    }
  };

  const handleDeleteExpenseLimit = () => {
    try {
      const limitId = getLimitId(currentLimit)
      if (!limitId) {
        console.error('No limit ID found. Current limit:', currentLimit)
        toast.error('Limit ID is missing. Please refresh and try again.')
        return
      }

      console.log('Deleting limit with ID:', limitId)
      deleteExpenseLimit();
    } catch (error) {
      console.error("Error deleting limit:", error);
      toast.error("Failed to delete limit");
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
