import { useEffect } from "react";

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

export function LeaveTypeActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useLeaveTypeStore();

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
    () => {
      closeModal();
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

  return (
    <>
      <LeaveTypeActionForm
        key="add-leave-type"
        form={form}
        editingId={currentRow ? currentRow.id : null}
        onSubmit={open === "edit" ? handleUpdate : handleCreate}
        open={open === "add" || open === "edit"}
        onOpenChange={(value: boolean) => {
          if (!value) closeModal();
          else setOpen(open === "edit" ? "edit" : "add");
        }}
        currentRow={currentRow}
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
