import { useEffect } from "react";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import {
  useUpdateMobileFeaturesConfig,
  useCreateMobilePermission,
  useUpdateMobilePermission,
  useDeleteMobilePermission,
  useCreateMobileFeatureSettings,
  useUpdateMobileFeatureSettings,
  useDeleteMobileFeatureSettings,
  MobileFeaturesConfigPayload,
  MobilePermissionPayload,

} from "../services/MobileFeatures.hook";
import { useMobileFeaturesStore } from "../store/mobile-features.store";
import {
  MobileFeaturesConfigActionForm,
  MobilePermissionActionForm,
} from "./action-form";
import {
  TMobileFeaturesConfigFormSchema,
  TMobilePermissionFormSchema,

} from "../data/schema";
import { toast } from "sonner";

export function MobileFeaturesActionModal() {
  const {
    open,
    setOpen,
    currentConfig,
    setCurrentConfig,
    currentPermission,
    setCurrentPermission,
    currentFeature,
    setCurrentFeature,
  } = useMobileFeaturesStore();

  // Mobile Features Configuration hooks
  const {
    mutate: updateMobileFeaturesConfig,
    isPending: isUpdateConfigLoading,
    isSuccess: isUpdateConfigSuccess,
    isError: isUpdateConfigError,
  } = useUpdateMobileFeaturesConfig();

  // Mobile Permission hooks
  const {
    mutate: createMobilePermission,
    isPending: isCreatePermissionLoading,
    isSuccess: isCreatePermissionSuccess,
    isError: isCreatePermissionError,
  } = useCreateMobilePermission();

  const {
    mutate: updateMobilePermission,
    isPending: isUpdatePermissionLoading,
    isSuccess: isUpdatePermissionSuccess,
    isError: isUpdatePermissionError,
  } = useUpdateMobilePermission(currentPermission?.permissionId || "");

  const {
    mutate: deleteMobilePermission,
    isSuccess: isDeletePermissionSuccess,
    isError: isDeletePermissionError,
  } = useDeleteMobilePermission(currentPermission?.permissionId || "");

  // Mobile Feature Settings hooks
  const {
    mutate: _createMobileFeatureSettings,
    // isPending: isCreateFeatureLoading,
    isSuccess: isCreateFeatureSuccess,
    isError: isCreateFeatureError,
  } = useCreateMobileFeatureSettings();

  const {
    mutate: _updateMobileFeatureSettings,
    // isPending: isUpdateFeatureLoading,
    isSuccess: isUpdateFeatureSuccess,
    isError: isUpdateFeatureError,
  } = useUpdateMobileFeatureSettings(currentFeature?.settingsId || "");

  const {
    mutate: _deleteMobileFeatureSettings,
    isSuccess: isDeleteFeatureSuccess,
    isError: isDeleteFeatureError,
  } = useDeleteMobileFeatureSettings(currentFeature?.settingsId || "");

  // Define closeModal function before using it in useEffect
  const closeModal = () => {
    setOpen(null);
    setTimeout(() => {
      setCurrentConfig(null);
      setCurrentPermission(null);
      setCurrentFeature(null);
    }, 300);
  };

  // Auto-close on successful operations
  useEffect(() => {
    if (
      (isUpdateConfigSuccess && !isUpdateConfigError) ||
      (isCreatePermissionSuccess && !isCreatePermissionError) ||
      (isUpdatePermissionSuccess && !isUpdatePermissionError) ||
      (isDeletePermissionSuccess && !isDeletePermissionError) ||
      (isCreateFeatureSuccess && !isCreateFeatureError) ||
      (isUpdateFeatureSuccess && !isUpdateFeatureError) ||
      (isDeleteFeatureSuccess && !isDeleteFeatureError)
    ) {
      closeModal();
    }
  }, [
    isUpdateConfigSuccess,
    isUpdateConfigError,
    isCreatePermissionSuccess,
    isCreatePermissionError,
    isUpdatePermissionSuccess,
    isUpdatePermissionError,
    isDeletePermissionSuccess,
    isDeletePermissionError,
    isCreateFeatureSuccess,
    isCreateFeatureError,
    isUpdateFeatureSuccess,
    isUpdateFeatureError,
    isDeleteFeatureSuccess,
    isDeleteFeatureError,
    closeModal,
  ]);

  // Mobile Features Configuration handlers
  const handleUpdateMobileFeaturesConfig = (
    values: TMobileFeaturesConfigFormSchema
  ) => {
    try {
      const payload: MobileFeaturesConfigPayload = {
        scheduleAndReports: {
          allowScheduleViewing: values.scheduleAndReports.allowScheduleViewing,
          allowVisitSummaryAccess:
            values.scheduleAndReports.allowVisitSummaryAccess,
          allowExpenseReportAccess:
            values.scheduleAndReports.allowExpenseReportAccess,
        },
        cameraAndPhoto: {
          enableSelfieCheckin: values.cameraAndPhoto.enableSelfieCheckin,
          allowPhotoCapture: values.cameraAndPhoto.allowPhotoCapture,
          allowReceiptPhotos: values.cameraAndPhoto.allowReceiptPhotos,
          photoQuality: values.cameraAndPhoto.photoQuality,
          maxPhotosPerVisit: values.cameraAndPhoto.maxPhotosPerVisit,
        },
        offlineCapabilities: {
          enableOfflineMode: values.offlineCapabilities.enableOfflineMode,
          autoSyncWhenOnline: values.offlineCapabilities.autoSyncWhenOnline,
          syncFrequency: values.offlineCapabilities.syncFrequency,
        },
      };

      updateMobileFeaturesConfig(payload);
    } catch (error) {
      console.error("Error updating mobile features config:", error);
      toast.error("Failed to update mobile features configuration");
    }
  };

  // Mobile Permission handlers
  const handleCreateMobilePermission = (
    values: TMobilePermissionFormSchema
  ) => {
    try {
      const payload: MobilePermissionPayload = {
        permissionName: values.permissionName.trim(),
        isEnabled: values.isEnabled,
        description: values.description?.trim(),
      };

      if (!payload.permissionName) {
        toast.error("Permission name is required");
        return;
      }

      createMobilePermission(payload);
    } catch (error) {
      console.error("Error creating mobile permission:", error);
      toast.error("Failed to create mobile permission");
    }
  };

  const handleUpdateMobilePermission = (
    values: TMobilePermissionFormSchema
  ) => {
    try {
      if (!currentPermission?.permissionId) {
        toast.error("Permission ID is missing");
        return;
      }

      const payload: MobilePermissionPayload = {
        permissionName: values.permissionName.trim(),
        isEnabled: values.isEnabled,
        description: values.description?.trim(),
      };

      if (!payload.permissionName) {
        toast.error("Permission name is required");
        return;
      }

      updateMobilePermission(payload);
    } catch (error) {
      console.error("Error updating mobile permission:", error);
      toast.error("Failed to update mobile permission");
    }
  };

  const handleDeleteMobilePermission = () => {
    try {
      if (!currentPermission?.permissionId) {
        toast.error("Permission ID is missing");
        return;
      }

      deleteMobilePermission();
    } catch (error) {
      console.error("Error deleting mobile permission:", error);
      toast.error("Failed to delete mobile permission");
    }
  };



  return (
    <>
      {/* Mobile Features Configuration Modal */}
      <MobileFeaturesConfigActionForm
        key="edit-config"
        open={open === "edit-config"}
        loading={isUpdateConfigLoading}
        currentConfig={currentConfig || undefined}
        onSubmit={handleUpdateMobileFeaturesConfig}
        onOpenChange={(value) => {
          if (!value) closeModal();
          else setOpen("edit-config");
        }}
      />

      {/* Mobile Permission Modals */}
      <MobilePermissionActionForm
        key="add-permission"
        open={open === "add-permission"}
        loading={isCreatePermissionLoading}
        onSubmit={handleCreateMobilePermission}
        onOpenChange={(value) => {
          if (!value) closeModal();
          else setOpen("add-permission");
        }}
      />

      {currentPermission && (
        <>
          <MobilePermissionActionForm
            key="edit-permission"
            open={open === "edit-permission"}
            loading={isUpdatePermissionLoading}
            currentPermission={currentPermission}
            onSubmit={handleUpdateMobilePermission}
            onOpenChange={(value) => {
              if (!value) closeModal();
              else setOpen("edit-permission");
            }}
          />

          <DeleteModal
            key="delete-permission"
            open={open === "delete-permission"}
            currentRow={currentPermission}
            itemIdentifier={"permissionId" as keyof typeof currentPermission}
            itemName="Mobile Permission"
            onDelete={handleDeleteMobilePermission}
            onOpenChange={(value) => {
              if (!value) closeModal();
              else setOpen("delete-permission");
            }}
          />
        </>
      )}
    </>
  );
}
