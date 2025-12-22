import { useEffect } from "react";

import { DeleteModal } from "@/components/shared/common-delete-modal";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useLeaveTypeStore } from "@/features/leave-management/store/leave-type.store";
import { useLeaveStore } from "@/features/leave-management/store/use-leave-store";
import { LeaveTypeSchema } from "@/features/leave-management/data/schema";
import LeaveTypeActionForm from "./leave-type-action-form";

export function LeaveTypeActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useLeaveTypeStore();
  const { addLeaveType, updateLeaveType, deleteLeaveType } = useLeaveStore();

  const form = useForm<z.infer<typeof LeaveTypeSchema>>({
    resolver: zodResolver(LeaveTypeSchema) as any,
    defaultValues: {
      name: "",
      balance: 0,
      allocationPeriod: "yearly",
      description: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (currentRow && open === "edit") {
      form.reset(currentRow);
    }
  }, [currentRow, open]);

  const closeModal = () => {
    setOpen(null);
    setTimeout(() => setCurrentRow(null), 300);
    form.reset();
  };

  const handleCreate = (values: any) => {
    addLeaveType(values);
    closeModal();
  };

  const handleUpdate = (values: any) => {
    if (currentRow?.id) updateLeaveType(currentRow.id, values);
    closeModal();
  };

  const handleDelete = () => {
    if (currentRow?.id) deleteLeaveType(currentRow.id);
    closeModal();
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
