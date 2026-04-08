import { useEffect } from "react";
import { format } from "date-fns";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import {
  useCreateUsers,
  useDeleteUser,
  useUpdateUser,
} from "../services/AllUsers.hook";
import { useUsersStore } from "../store/users.store";
import { UserActionForm } from "./action-form";
import { useAuthStore } from "@/stores/use-auth-store";

export function UsersActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsersStore();
  const { user } = useAuthStore();
  const allowTerritoryFilter =
    user?.organization?.allowAddUsersBasedOnTerritories;

  const {
    mutate: createUser,
    isPending: isCreateLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateUsers();

  const {
    mutate: updateUser,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateUser(currentRow?.id || "");

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

  const handleCreateUser = (values: any) => {
    const fullPhone = values.phoneNumber || "";
    const nationalNumber = fullPhone.replace(values.countryCode, "");
    const payload: any = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: nationalNumber,
      countryCode: values.countryCode,
      tierkey: values.tierkey,
      roleId: values.roleId,
      jobTitle: "",
      departmentId: values.departmentId,
      reportingToRoleId: values.reportingToRoleId,
      isWebUser: values.isWebUser ?? false,
      reportingToIds: Array.isArray(values.reportingToIds)
        ? values.reportingToIds
        : values.reportingToIds
          ? [values.reportingToIds]
          : [],
      shiftId: values.shiftId || null,
      joiningDate: values.joiningDate
        ? format(new Date(values.joiningDate), "dd-MM-yyyy")
        : null,
    };

    if (allowTerritoryFilter) {
      payload.territoryId = values.territoryId;
    }

    createUser(payload);
  };

  const handleUpdateUser = (values: any) => {
    const fullPhone = values.phoneNumber || "";
    const nationalNumber = fullPhone.replace(values.countryCode, "");
    const payload: any = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: nationalNumber,
      countryCode: values.countryCode,
      tierkey: values.tierkey,
      roleId: values.roleId,
      jobTitle: "",
      departmentId: values.departmentId,
      reportingToRoleId: values.reportingToRoleId,
      isWebUser: values.isWebUser ?? false,
      reportingToIds: Array.isArray(values.reportingToIds)
        ? values.reportingToIds
        : values.reportingToIds
          ? [values.reportingToIds]
          : [],
      shiftId: values.shiftId || null,
      joiningDate: values.joiningDate
        ? format(new Date(values.joiningDate), "dd-MM-yyyy")
        : null,
    };
    if (allowTerritoryFilter) {
      payload.territoryId = values.territoryId;
    }

    updateUser(payload);
  };

  const { mutate: deleteUser } = useDeleteUser(currentRow?.id || "", () => {
    closeModal();
  });

  const handleDeleteUser = () => {
    if (currentRow?.id) {
      deleteUser();
    } else {
      closeModal();
    }
  };

  return (
    <>
      {/* Add Modal */}
      <UserActionForm
        key="add-user"
        open={open === "add"}
        loading={isCreateLoading}
        onSubmit={handleCreateUser}
        onOpenChange={(value) => {
          if (!value) closeModal();
          else setOpen("add");
        }}
        allowTerritoryFilter={allowTerritoryFilter}
      />

      {/* Edit + Delete Modals */}
      {currentRow && (
        <>
          <UserActionForm
            key={`users-action-edit-${currentRow.id || currentRow.created_at}`}
            open={open === "edit"}
            loading={isUpdateLoading}
            currentRow={currentRow}
            onSubmit={handleUpdateUser}
            onOpenChange={(value) => {
              if (!value) {
                setOpen(null);
                setTimeout(() => setCurrentRow(null), 300);
              } else {
                setOpen("edit");
              }
            }}
            allowTerritoryFilter={allowTerritoryFilter}
          />

          <DeleteModal
            key={`users-action-delete-${currentRow.createdDate || currentRow.created_at}`}
            open={open === "delete"}
            itemName={"User"}
            onDelete={handleDeleteUser}
            onOpenChange={(value) => {
              if (!value) {
                setOpen(null);
                setTimeout(() => setCurrentRow(null), 300);
              } else {
                setOpen("delete");
              }
            }}
            itemIdentifier={"fullName" as keyof typeof currentRow}
            currentRow={{
              ...currentRow,
              fullName: `${currentRow.firstName} ${currentRow.lastName}`,
            }}
          />
        </>
      )}
    </>
  );
}
