import { useEffect } from "react";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import { useCategoryStore } from "../../../store/expenses-category.store";
import { CategoryActionForm } from "./categoryActionForm";
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/features/approvals/services/category.action.hook";

export function CategoryActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategoryStore();
  const {
    mutate: createCategory,
    isPending: isCreateLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateCategory();

  const {
    mutate: updateCategory,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateCategory(currentRow?.expensesCategoryId || "");

  // Auto-close on successful create/update
  useEffect(() => {
    if (
      (isCreateSuccess && !isCreateError) ||
      (isUpdateSuccess && !isUpdateError)
    ) {
      closeModal();
    }
  }, [isCreateSuccess, isCreateError, isUpdateSuccess, isUpdateError]);

  const closeModal = () => {
    setOpen(null);
    setTimeout(() => setCurrentRow(null), 300);
  };

  const handleCreateCategory = (values: any) => {
    const payload = {
      categoryName: values.categoryName.trim(),
    };
    createCategory(payload);
  };

  const handleUpdateCategory = (values: any) => {
    const payload = {
      categoryName: values.categoryName.trim(),
    };
    updateCategory(payload);
  };

  const { mutate: deleteCategory } = useDeleteCategory(
    currentRow?.expensesCategoryId || "",
    () => {
      closeModal();
    }
  );
  const handleDeleteCategory = () => {
    if (currentRow?.expensesCategoryId) {
      deleteCategory();
    } else {
      closeModal();
    }
  };

  return (
    <>
      {/* Add Modal */}
      <CategoryActionForm
        key="add-category"
        open={open === "add"}
        loading={isCreateLoading}
        onSubmit={handleCreateCategory}
        onOpenChange={(value) => {
          if (!value) closeModal();
          else setOpen("add");
        }}
      />

      {/* Edit + Delete Modals */}
      {currentRow && (
        <>
          <CategoryActionForm
            key="edit-category"
            open={open === "edit"}
            loading={isUpdateLoading}
            currentRow={currentRow}
            onSubmit={handleUpdateCategory}
            onOpenChange={(value) => {
              if (!value) closeModal();
              else setOpen("edit");
            }}
          />

          <DeleteModal
            key="delete-category"
            open={open === "delete"}
            currentRow={currentRow}
            itemIdentifier={"id" as keyof typeof currentRow}
            itemName="Category"
            onDelete={handleDeleteCategory}
            onOpenChange={(value) => {
              if (!value) closeModal();
              else setOpen("delete");
            }}
          />
        </>
      )}
    </>
  );
}
