import { useEffect } from "react";

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

export function ShiftActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useShiftStore();

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

  return (
    <>
      <ShiftActionForm
        key="add-shift"
        form={form}
        editingId={currentRow ? currentRow.id : null}
        onSubmit={open === "edit" ? handleUpdate : handleCreate}
        open={open === "add" || open === "edit"}
        onOpenChange={(value: boolean) => {
          if (!value) closeModal();
          else setOpen(open === "edit" ? "edit" : "add");
        }}
        currentRow={currentRow}
        allShifts={[]} // Not needed anymore but keeping for interface
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
