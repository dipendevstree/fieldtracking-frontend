import { useEffect } from "react";
import { format } from "date-fns";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import {
  useAssignPlan,
  useCreateOrganization,
  useExtendGracePeriod,
  useRenewPlan,
  useSuspendOrganization,
  useUpdateOrganization,
} from "../services/organization.hook";
import { useOrganizationStore } from "../store/organizations.store";
import { OrganizationEditForm } from "./OrganizationEditForm";
import { OrganizationActionForm } from "./action-form";
import { PlanActionForm } from "./plan-action-form";
import { SuspendOrganizationForm } from "./suspend-form";
import { ExtendGracePeriodForm } from "./grace-period-form";
import {
  TExtendGracePeriodSchema,
  TPlanAssignmentSchema,
  TSuspendSchema,
} from "../data/schema";

// Convert date from yyyy-MM-dd to dd-MM-yyyy for API
const formatDateForApi = (dateStr: string): string => {
  if (!dateStr) return "";
  return format(new Date(dateStr), "dd-MM-yyyy");
};

export function OrganizationsActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useOrganizationStore();
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

  const {
    mutate: assignPlan,
    isPending: isAssignLoading,
    isSuccess: isAssignSuccess,
  } = useAssignPlan(currentRow?.organizationID);

  const {
    mutate: renewPlan,
    isPending: isRenewLoading,
    isSuccess: isRenewSuccess,
  } = useRenewPlan(currentRow?.organizationID);

  const {
    mutate: suspendOrganization,
    isPending: isSuspendLoading,
    isSuccess: isSuspendSuccess,
  } = useSuspendOrganization(currentRow?.organizationID);

  const {
    mutate: extendGracePeriod,
    isPending: isExtendLoading,
    isSuccess: isExtendSuccess,
  } = useExtendGracePeriod(currentRow?.organizationID);

  useEffect(() => {
    if (
      (isCreateSuccess ||
        isUpdateSuccess ||
        isAssignSuccess ||
        isRenewSuccess ||
        isSuspendSuccess ||
        isExtendSuccess) &&
      !(isCreateError || isUpdateError)
    ) {
      setOpen(null); // Close the dialog on success
      setCurrentRow(null); // Clear current row
    }
  }, [
    isCreateSuccess,
    isUpdateSuccess,
    isAssignSuccess,
    isRenewSuccess,
    isSuspendSuccess,
    isExtendSuccess,
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
      is_separate_schema: values.isSeparateSchema,
      adminName: values.adminName,
      adminEmail: values.adminEmail,
      adminPhone: nationalNumber,
      adminJobTitle: values.adminJobTitle,
      menuIds: values.menuIds, // array of selected module IDs
      adminPhoneCountryCode: values.adminPhoneCountryCode,
      maxUsers: values.maxUsers,
    };
    createOrganization(payload);
  };

  const handleUpdateOrganization = (values: any) => {
    if (!currentRow) return;

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
      maxUsers: values.maxUsers,
    };

    updateOrganization(payload);
  };

  const handleActivatePlan = (values: TPlanAssignmentSchema) => {
    const payload = {
      ...values,
      planStartDate: formatDateForApi(values.planStartDate),
    };
    assignPlan(payload);
  };

  const handleRenewPlan = (values: TPlanAssignmentSchema) => {
    const payload = {
      ...values,
      planStartDate: formatDateForApi(values.planStartDate),
    };
    renewPlan(payload);
  };

  const handleSuspendOrganization = (values: TSuspendSchema) => {
    suspendOrganization(values);
  };

  const handleExtendGracePeriod = (values: TExtendGracePeriodSchema) => {
    extendGracePeriod(values);
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

          <PlanActionForm
            key={`activate-plan-${currentRow.organizationID}`}
            open={open === "activatePlan"}
            onOpenChange={(value) => setOpen(value ? "activatePlan" : null)}
            onSubmit={handleActivatePlan}
            loading={isAssignLoading}
            title="Activate Plan"
            description="Assign a new plan to this organization."
          />

          <PlanActionForm
            key={`renew-plan-${currentRow.organizationID}`}
            open={open === "renewPlan"}
            onOpenChange={(value) => setOpen(value ? "renewPlan" : null)}
            onSubmit={handleRenewPlan}
            loading={isRenewLoading}
            title="Renew Plan"
            description="Renew the current plan for this organization."
          />

          <SuspendOrganizationForm
            key={`suspend-org-${currentRow.organizationID}`}
            open={open === "suspendOrganization"}
            onOpenChange={(value) =>
              setOpen(value ? "suspendOrganization" : null)
            }
            onSubmit={handleSuspendOrganization}
            loading={isSuspendLoading}
          />

          <ExtendGracePeriodForm
            key={`extend-grace-period-${currentRow.organizationID}`}
            open={open === "extendGracePeriod"}
            onOpenChange={(value) =>
              setOpen(value ? "extendGracePeriod" : null)
            }
            onSubmit={handleExtendGracePeriod}
            loading={isExtendLoading}
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
