import { useEffect, useState } from "react";

import { DeleteModal } from "@/components/shared/common-delete-modal";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useShiftStore } from "@/features/attendance-management/store/shift.store";
import {
  useCreateShift,
  useUpdateShift,
  useDeleteShift,
} from "@/features/attendance-management/services/shift.action.hook";
import { ShiftSchema } from "@/features/attendance-management/data/schema";
import ShiftActionForm from "./shift-action-form";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useDirtyTracker } from "@/features/settings/store/use-unsaved-changes-store";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export function ShiftActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useShiftStore();
  const [showLocalWarning, setShowLocalWarning] = useState(false);

  const {
    mutate: createShift,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateShift();

  const {
    mutate: updateShiftMutate,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateShift(currentRow?.id || "");

  const closeModal = () => {
    setOpen(null);
    setTimeout(() => setCurrentRow(null), 300);
    form.reset();
  };

  const { mutate: deleteShift } = useDeleteShift(currentRow?.id || "", () => {
    closeModal();
  });
  const form = useForm<z.infer<typeof ShiftSchema>>({
    resolver: zodResolver(ShiftSchema) as any,
    defaultValues: {
      name: "",
      startTime: "",
      endTime: "",
      breakMinutes: 0,
      fullDayHours: 0,
      halfDayHours: 0,
      isDefault: false,
    },
  });

  // Reset form when modal mode changes:
  useEffect(() => {
    if (open === "add") {
      form.reset({
        name: "",
        startTime: "",
        endTime: "",
        breakMinutes: 0,
        fullDayHours: 0,
        halfDayHours: 0,
        isDefault: false,
      });
      setCurrentRow(null);
    } else if (open === "edit" && currentRow) {
      form.reset(currentRow);
    }
  }, [open, currentRow]);

  // Auto-close on successful create/update
  useEffect(() => {
    if (
      (isCreateSuccess && !isCreateError) ||
      (isUpdateSuccess && !isUpdateError)
    ) {
      closeModal();
    }
  }, [isCreateSuccess, isCreateError, isUpdateSuccess, isUpdateError]);

  const handleCreate = (values: any) => {
    createShift(values);
  };

  const handleUpdate = (values: any) => {
    if (currentRow?.id) {
      updateShiftMutate(values);
    }
  };

  const handleDelete = () => {
    if (currentRow?.id) deleteShift();
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
    actualClose();

    if (showExitPrompt) {
      setTimeout(() => {
        confirmExit();
      }, 0);
    }
  };

  return (
    <>
      <ShiftActionForm
        key="add-shift"
        form={form}
        editingId={currentRow ? currentRow.id : null}
        onSubmit={open === "edit" ? handleUpdate : handleCreate}
        open={open === "add" || open === "edit"}
        onOpenChange={handleDialogChange}
        currentRow={currentRow}
        allShifts={[]} // Not needed anymore but keeping for interface
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
          key="delete-shift"
          open={open === "delete"}
          currentRow={currentRow}
          itemIdentifier={"name" as keyof typeof currentRow}
          itemName="Shift"
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

export default ShiftActionModal;
