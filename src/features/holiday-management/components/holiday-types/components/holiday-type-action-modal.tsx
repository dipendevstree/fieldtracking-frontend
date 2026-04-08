import { useEffect } from "react";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import HolidayTypeActionForm from "./holiday-type-action-form";
import { useHolidayTypeStore } from "@/features/holiday-management/store/holiday-type.store";
import {
  useCreateHolidayType,
  useDeleteHolidayType,
  useUpdateHolidayType,
} from "@/features/holiday-management/services/holiday-type.action.hook";
import { HolidayTypeSchema } from "@/features/holiday-management/data/schema";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useState } from "react";
import { useDirtyTracker } from "@/features/settings/store/use-unsaved-changes-store";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export function HolidayTypeActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useHolidayTypeStore();
  const [showLocalWarning, setShowLocalWarning] = useState(false);

  const {
    mutate: createHolidayType,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateHolidayType();

  const {
    mutate: updateHolidayType,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateHolidayType(currentRow?.id || "");

  const closeModal = () => {
    setOpen(null);
    setTimeout(() => setCurrentRow(null), 300);
    form.reset();
  };

  const { mutate: deleteHolidayType } = useDeleteHolidayType(
    currentRow?.id || "",
    () => {
      closeModal();
    }
  );

  const form = useForm<z.infer<typeof HolidayTypeSchema>>({
    resolver: zodResolver(HolidayTypeSchema) as any,
    defaultValues: {
      holidayTypeName: "",
    },
  });

  useEffect(() => {
    if (open === "add") {
      form.reset({
        holidayTypeName: "",
      });
      setCurrentRow(null);
    } else if (open === "edit" && currentRow) {
      form.reset(currentRow);
    }
  }, [open, currentRow]);

  useEffect(() => {
    if (
      (isCreateSuccess && !isCreateError) ||
      (isUpdateSuccess && !isUpdateError)
    ) {
      closeModal();
    }
  }, [isCreateSuccess, isCreateError, isUpdateSuccess, isUpdateError]);

  const handleCreate = (values: any) => {
    createHolidayType(values);
  };

  const handleUpdate = (values: any) => {
    if (currentRow?.id) updateHolidayType({ ...values, id: undefined });
  };

  const handleDelete = () => {
    if (currentRow?.id) deleteHolidayType();
  };

  const handleDialogChange = (state: boolean) => {
    if (state) {
      setOpen(open === "edit" ? "edit" : "add");
      return;
    }
    if (form.formState.isDirty) {
      setShowLocalWarning(true);
    } else {
      actualClose();
    }
  };

  const actualClose = () => {
    form.reset();
    setOpen(null);
    setCurrentRow(null);
  };

  useDirtyTracker(form.formState.isDirty);

  const { showExitPrompt, confirmExit, cancelExit } = useUnsavedChanges(
    form.formState.isDirty
  );

  const isWarningOpen = showLocalWarning || showExitPrompt;

  const handleCancelDiscard = (isOpen: boolean) => {
    if (!isOpen) {
      setShowLocalWarning(false);
      if (showExitPrompt) cancelExit();
    }
  };

  const handleConfirmDiscard = () => {
    form.reset(form.getValues());
    setShowLocalWarning(false);
    setOpen(null);
    setCurrentRow(null);

    if (showExitPrompt) {
      setTimeout(() => {
        confirmExit();
      }, 0);
    }
  };

  return (
    <>
      <HolidayTypeActionForm
        key="add-holiday-type"
        form={form}
        editingId={currentRow?.id || null}
        onSubmit={open === "edit" ? handleUpdate : handleCreate}
        open={open === "add" || open === "edit"}
        onOpenChange={handleDialogChange}
      />

      <ConfirmDialog
        open={isWarningOpen}
        onOpenChange={handleCancelDiscard}
        title="Unsaved Changes"
        desc="You have unsaved changes. Are you sure you want to discard them? Your changes will be lost."
        confirmText="Discard Changes"
        cancelBtnText="Keep Editing"
        destructive={true}
        handleConfirm={handleConfirmDiscard}
      />

      {currentRow && (
        <DeleteModal
          key="delete-holiday-type"
          open={open === "delete"}
          currentRow={currentRow}
          itemIdentifier={"holidayTypeName" as keyof typeof currentRow}
          itemName="Holiday Type"
          onDelete={handleDelete}
          onOpenChange={(value: boolean) => {
            if (!value) closeModal();
            else setOpen("delete");
          }}
        />
      )}
    </>
  );
}

export default HolidayTypeActionModal;
