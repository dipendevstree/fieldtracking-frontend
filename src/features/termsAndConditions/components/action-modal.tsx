import { useEffect } from "react";
import { DeleteModal } from "@/components/shared/common-delete-modal";

import { TFormSchemaTerms } from "../data/schema";
import { useTermsStore } from "./termsAndConditions.store";
import { TermActionForm } from "./action-form";
import {
  useCreatetermsAndConditions,
  useDeletetermsAndConditions,
  useUpdatetermsAndConditions,
} from "../services/TermsAndConditions.hook";

export function TermActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useTermsStore();

  const {
    mutate: createTerm,
    isPending: isCreateLoading,
    isSuccess: isCreateSuccess,
  } = useCreatetermsAndConditions();
  const {
    mutate: updateTerm,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
  } = useUpdatetermsAndConditions(currentRow?.id || "");

  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      closeModal();
    }
  }, [isCreateSuccess, isUpdateSuccess]);

  const closeModal = () => {
    setOpen(null);
    setTimeout(() => setCurrentRow(null), 300);
  };

  const handleCreateTerm = (values: TFormSchemaTerms) => {
    createTerm(values);
  };

  const handleUpdateTerm = (values: TFormSchemaTerms) => {
    // Only send changed values
    const payload: Partial<TFormSchemaTerms> = {};
    if (values.content !== currentRow?.content) {
      payload.content = values.content;
    }
    // Add other fields like isActive if you add them to the form
    if (Object.keys(payload).length > 0) {
      updateTerm(payload);
    } else {
      closeModal(); // Nothing changed
    }
  };

  const { mutate: deleteTerm } = useDeletetermsAndConditions(
    currentRow?.id || "",
    closeModal
  );
  const handleDeleteTerm = () => {
    if (currentRow?.id) {
      deleteTerm();
    }
  };

  return (
    <>
      <TermActionForm
        key="add-term"
        open={open === "add"}
        loading={isCreateLoading}
        onSubmit={handleCreateTerm}
        onOpenChange={(value) => !value && closeModal()}
      />

      {currentRow && (
        <>
          <TermActionForm
            key="edit-term"
            open={open === "edit"}
            loading={isUpdateLoading}
            currentRow={currentRow}
            onSubmit={handleUpdateTerm}
            onOpenChange={(value) => !value && closeModal()}
          />

          <DeleteModal
            key="delete-term"
            open={open === "delete"}
            currentRow={{
              ...currentRow,
              identifier: `document of type "${currentRow.type}"`,
            }}
            itemIdentifier={"identifier" as any}
            itemName="Document"
            onDelete={handleDeleteTerm}
            onOpenChange={(value) => !value && closeModal()}
          />
        </>
      )}
    </>
  );
}
