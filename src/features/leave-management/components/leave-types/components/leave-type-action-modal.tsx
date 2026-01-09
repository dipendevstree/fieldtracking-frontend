import { useEffect, useState } from "react";

import { DeleteModal } from "@/components/shared/common-delete-modal";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useLeaveTypeStore } from "@/features/leave-management/store/leave-type.store";
import {
  useCreateLeaveType,
  useUpdateLeaveType,
  useDeleteLeaveType,
} from "@/features/leave-management/services/leave-type.action.hook";
import { LeaveTypeSchema } from "@/features/leave-management/data/schema";
import LeaveTypeActionForm from "./leave-type-action-form";
import { useDirtyTracker } from "@/features/settings/store/use-unsaved-changes-store";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";

export function LeaveTypeActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useLeaveTypeStore();
  const [showLocalWarning, setShowLocalWarning] = useState(false);

  const {
    mutate: createLeaveType,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateLeaveType();

  const {
    mutate: updateLeaveTypeMutate,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateLeaveType(currentRow?.id || "");

  const closeModal = () => {
    setOpen(null);
    setTimeout(() => setCurrentRow(null), 300);
    form.reset();
  };

  const { mutate: deleteLeaveType } = useDeleteLeaveType(
    currentRow?.id || "",
    (data) => {
      toast.success(
        data?.response?.data?.message || "Leave Type deleted successfully",
        {
          position: "top-center",
          duration: 2000,
        }
      );
      closeModal();
    },
    (error) => {
      toast.error(
        error?.response?.data?.data?.message || "Failed to delete Leave Type",
        {
          duration: 2000,
          position: "top-right",
        }
      );
    }
  );
  const form = useForm<z.infer<typeof LeaveTypeSchema>>({
    resolver: zodResolver(LeaveTypeSchema) as any,
    defaultValues: {
      name: "",
      leaveBalance: 0,
      allocationPeriod: "Yearly",
      requiresAttachment: false,
      description: "",
    },
  });

  // Reset form when modal mode changes:
  useEffect(() => {
    if (open === "add") {
      form.reset({
        name: "",
        leaveBalance: 0,
        allocationPeriod: "Yearly",
        requiresAttachment: false,
        description: "",
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
    createLeaveType(values);
  };

  const handleUpdate = (values: any) => {
    if (currentRow?.id) updateLeaveTypeMutate(values);
  };

  const handleDelete = () => {
    if (currentRow?.id) deleteLeaveType();
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
      <LeaveTypeActionForm
        key="add-leave-type"
        form={form}
        editingId={currentRow ? currentRow.id : null}
        onSubmit={open === "edit" ? handleUpdate : handleCreate}
        open={open === "add" || open === "edit"}
        onOpenChange={handleDialogChange}
        currentRow={currentRow}
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
          key="delete-leave-type"
          open={open === "delete"}
          currentRow={currentRow}
          itemIdentifier={"name" as keyof typeof currentRow}
          itemName="Leave Type"
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

export default LeaveTypeActionModal;
