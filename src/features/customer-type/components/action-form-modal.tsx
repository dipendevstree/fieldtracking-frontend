import { useEffect } from "react";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import {
  useCreateCustomerType,
  useUpdateCustomerType,
  useDeleteCustomerType,
  CustomerTypePayload,
} from "../services/CustomerType.hook";
import { useCustomerTypeStore } from "../store/customer-type.store";
import { CustomerTypeActionForm } from "./action-form";
import { TFormSchema } from "../data/schema";
import { toast } from "sonner";

export function CustomerTypeActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useCustomerTypeStore();
  const {
    mutate: createCustomerType,
    isPending: isCreateLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateCustomerType();

  const {
    mutate: updateCustomerType,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateCustomerType(currentRow?.customerTypeId || "");

  const {
    mutate: deleteCustomerType,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
  } = useDeleteCustomerType(currentRow?.customerTypeId || "");

  // Auto-close on successful create/update/delete
  useEffect(() => {
    if (
      (isCreateSuccess && !isCreateError) ||
      (isUpdateSuccess && !isUpdateError) ||
      (isDeleteSuccess && !isDeleteError)
    ) {
      setOpen(null);
    }
  }, [
    isCreateSuccess,
    isCreateError,
    isUpdateSuccess,
    isUpdateError,
    isDeleteSuccess,
    isDeleteError,
    setOpen,
  ]);

  const closeModal = () => {
    setOpen(null);
    setTimeout(() => setCurrentRow(null), 300);
  };

  const handleCreateCustomerType = (values: TFormSchema) => {
    const payload: CustomerTypePayload = {
      typeName: values.typeName.trim(),
    };

    if (!payload.typeName) {
      toast.error("Customer Type name is required");
      return;
    }

    createCustomerType(payload);
  };

  const handleUpdateCustomerType = (values: TFormSchema) => {
    if (!currentRow?.customerTypeId) {
      toast.error("Customer Type ID is missing");
      return;
    }

    const payload: CustomerTypePayload = {
      typeName: values.typeName.trim(),
    };

    if (!payload.typeName) {
      toast.error("Customer Type name is required");
      return;
    }

    updateCustomerType(payload);
  };

  const handleDeleteCustomerType = () => {
    if (!currentRow?.customerTypeId) {
      toast.error("Customer Type ID is missing");
      return;
    }

    deleteCustomerType();
  };

  return (
    <>
      {/* Add Modal */}
      <CustomerTypeActionForm
        key="add-customer-type"
        open={open === "add"}
        loading={isCreateLoading}
        onSubmit={handleCreateCustomerType}
        onOpenChange={(value) => {
          if (!value) closeModal();
          else setOpen("add");
        }}
        resetOnSubmitSuccess
      />

      {/* Edit + Delete Modals */}
      {currentRow && (
        <>
          <CustomerTypeActionForm
            key="edit-customer-type"
            open={open === "edit"}
            loading={isUpdateLoading}
            currentRow={currentRow}
            onSubmit={handleUpdateCustomerType}
            onOpenChange={(value) => {
              if (!value) closeModal();
              else setOpen("edit");
            }}
          />

          <DeleteModal
            key="delete-customer-type"
            open={open === "delete"}
            currentRow={currentRow}
            itemIdentifier={"customerTypeId" as keyof typeof currentRow}
            itemName="Customer Type"
            onDelete={handleDeleteCustomerType}
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
