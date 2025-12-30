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

export function HolidayTypeActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useHolidayTypeStore();

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

  return (
    <>
      <HolidayTypeActionForm
        key="add-holiday-type"
        form={form}
        editingId={currentRow?.id || null}
        onSubmit={open === "edit" ? handleUpdate : handleCreate}
        open={open === "add" || open === "edit"}
        onOpenChange={(value: boolean) => {
          if (!value) closeModal();
          else setOpen(open === "edit" ? "edit" : "add");
        }}
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
