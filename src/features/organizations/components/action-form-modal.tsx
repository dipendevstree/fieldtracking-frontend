import { useEffect } from "react";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import {
  useCreateOrganization,
  useUpdateOrganization,
} from "../services/organization.hook";
import { useUsersStore } from "../store/organizations.store";
import { OrganizationEditForm } from "./OrganizationEditForm";
import { OrganizationActionForm } from "./action-form";

export function OrganizationsActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsersStore();
  const {
    mutate: updateOrganization,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateOrganization(currentRow?.organizationID);

  const {
    mutate: createOrganization,
    isPending: isCreateLoading,
    isError: isCreateError,
    isSuccess: isCreateSuccess,
  } = useCreateOrganization();

  useEffect(() => {
    if (
      (isCreateSuccess || isUpdateSuccess) &&
      !(isCreateError || isUpdateError)
    ) {
      setOpen(null); // Close the dialog on success
      setCurrentRow(null); // Clear current row
    }
  }, [
    isCreateSuccess,
    isUpdateSuccess,
    isCreateError,
    isUpdateError,
    setOpen,
    setCurrentRow,
  ]);

  const handleCreateOrganization = (values: any) => {
    const fullPhone = values.adminPhone || "";
    const nationalNumber = fullPhone.replace(values.adminPhoneCountryCode, "");
    const payload = {
      organizationName: values.name,
      industryId: values.industry,
      employeeRangeId: values.employeeRange,
      is_separate_schema: false,
      adminName: values.adminName,
      adminEmail: values.adminEmail,
      adminPhone: nationalNumber,
      adminJobTitle: values.adminJobTitle,
      menuIds: values.menuIds, // array of selected module IDs
      adminPhoneCountryCode: values.adminPhoneCountryCode,
    };
    createOrganization(payload);
  };

  const handleUpdateOrganization = (values: any) => {
    if (!currentRow) return;
    console.log("currentRowqqqqqq", values);
    const payload = {
      organizationName: values.organizationName,
      industryId: values.industryId,
      employeeRangeId: values.employeeRangeId,
      organizationTypeId: values.organizationTypes,
      website: values.website,
      description: values.description,
      address: values.address,
      country: values.country,
      city: values.city,
      zipCode: values.zipCode,
      state: values.state,
      isActive: values.isActive,
      menuIds: values.menuIds,
    };
    console.log("payload111", payload);

    updateOrganization(payload);
  };

  const handleDeleteOrganization = () => {
    setOpen(null);
    setCurrentRow(null);
  };

  return (
    <>
      {/* Create Organization Form - Uses the combined form with admin details */}
      <OrganizationActionForm
        key="add-organization"
        open={open === "add"}
        loading={isCreateLoading}
        onOpenChange={(value) => setOpen(value ? "add" : null)}
        onSubmit={handleCreateOrganization}
      />

      {/* Edit Organization Form - Uses the new edit-only form */}
      {currentRow && (
        <>
          <OrganizationEditForm
            key={`organization-edit-${currentRow.organizationId || currentRow.id}`}
            open={open === "edit"}
            loading={isUpdateLoading}
            onSubmit={handleUpdateOrganization}
            currentRow={currentRow}
            onOpenChange={(value) => {
              if (!value) {
                setOpen(null);
                setTimeout(() => setCurrentRow(null), 300);
              } else {
                setOpen("edit");
              }
            }}
          />
          <DeleteModal
            onDelete={handleDeleteOrganization}
            key={`organization-delete-${currentRow.createdDate || currentRow.created_at}`}
            open={open === "delete"}
            itemIdentifier={"organizationId"}
            itemName={"Organization"}
            onOpenChange={() => {
              setOpen(null);
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
