import { useState, useCallback } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { Main } from "@/components/layout/main";
import { toast } from "sonner";
import GeneralSettings from "./components/GeneralSetting";
import { GeneralSettingsActionModal } from "./components/action-form-modal";
import { useUpdateGeneralSettings } from "./services/Generalhook";
import { useAuth } from "@/stores/use-auth-store";
import { Card } from "@/components/ui/card";
import { usePermissionData } from "@/hooks/use-permission-data";

const GeneralSettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [_pagination, _setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });
  const [submitFixedExpenseForm, setSubmitFixedExpenseForm] =
    useState<Function | null>();
  const [currentSettingsData, setCurrentSettingsData] = useState<any>(null);
  const { mutate } = usePermissionData({
    onSuccess(data) {
      updateUser({
        ...user,
        ...data,
        role: {
          ...user?.role,
          ...data?.role,
        },
        organization: {
          ...user?.organization,
          ...data.organization,
        },
      });
    },
  });
  const [isFixedExpenseDirty, setIsFixedExpenseDirty] = useState(false);
  // API hooks for updating data
  const organizationId = user?.organization?.organizationID;
  const { mutate: updateGeneralSettings, isPending: isGeneralSettingsLoading } =
    useUpdateGeneralSettings(organizationId);

  const isLoading = isGeneralSettingsLoading;

  // Handle data changes from the component
  const handleDataChange = useCallback((data: any) => {
    setCurrentSettingsData(data);
    setIsFixedExpenseDirty(isFixedExpenseDirty);
  }, []);

  const handleSaveSettings = async () => {
    if (!currentSettingsData) {
      toast.error("No data to save");
      return;
    }

    // Validate required fields
    const requiredFields = [
      "organizationName",
      "organizationType",
      "website",
      "streetAddress",
      "city",
      "state",
      "zipCode",
      "country",
      "userDepartment",
    ];

    const missingFields = requiredFields.filter(
      (field) => !currentSettingsData[field]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    // Validate rate per KM when auto-expense is enabled
    if (
      currentSettingsData.autoExpenseApproval &&
      (!currentSettingsData.ratePerKm ||
        parseFloat(currentSettingsData.ratePerKm) <= 0)
    ) {
      toast.error(
        "Rate per KM is required when auto-expense approval is enabled"
      );
      return;
    }

    if (currentSettingsData?.fixedDayExpense && submitFixedExpenseForm) {
      const result = await submitFixedExpenseForm();
      if (!result) return;
    }

    try {
      // Prepare payload that matches your API structure
      const formData = new FormData();
      formData.append("organizationName", currentSettingsData.organizationName);
      formData.append("industryId", currentSettingsData.industryId || ""); // You may need to add this fiel);
      formData.append(
        "organizationTypeId",
        currentSettingsData.organizationType
      );
      formData.append("website", currentSettingsData.website);
      formData.append("description", currentSettingsData.description);
      formData.append("address", currentSettingsData.streetAddress);
      formData.append("country", currentSettingsData.country);
      formData.append("city", currentSettingsData.city);
      formData.append("zipCode", currentSettingsData.zipCode);
      formData.append("state", currentSettingsData.state);
      formData.append("isActive", String(true));
      formData.append(
        "isAutoExpense",
        currentSettingsData.autoExpenseApproval ? "true" : ""
      );
      formData.append(
        "isFixedDayExpense",
        currentSettingsData.fixedDayExpense ? "true" : ""
      );
      formData.append(
        "rsPerKm",
        currentSettingsData.autoExpenseApproval
          ? currentSettingsData.ratePerKm || 0
          : 0
      );
      formData.append(
        "allowAddUsersBasedOnTerritories",
        currentSettingsData.allowAddUsersBasedOnTerritories ? "true" : ""
      );
      formData.append(
        "allowWorkFromHome",
        currentSettingsData.allowWorkFromHome ? "true" : ""
      );
      formData.append("currency", currentSettingsData.currency || "");
      formData.append("orgIcon", currentSettingsData.orgIcon || null);
      formData.append("profileImage", currentSettingsData.profileImage || null);
      formData.append(
        "userFirstName",
        currentSettingsData.userFirstName || null
      );
      formData.append("userLastName", currentSettingsData.userLastName || null);
      formData.append("userEmail", currentSettingsData.userEmail || null);
      formData.append(
        "userPhoneNumber",
        currentSettingsData.userPhoneNumber || null
      );
      formData.append(
        "userPhoneCode",
        currentSettingsData.userPhoneCode || null
      );
      formData.append(
        "userDepartment",
        currentSettingsData.userDepartment || null
      );
      formData.append(
        "removeOrgIcon",
        currentSettingsData.removeOrgIcon ? "true" : ""
      );
      formData.append(
        "removeProfileImage",
        currentSettingsData.removeProfileImage ? "true" : ""
      );
      // console.log('Organization update payload:', organizationUpdatePayload)

      // Update organization data
      await new Promise((resolve, reject) => {
        updateGeneralSettings(formData, {
          onSuccess: () => {
            mutate();
            resolve(true);
            return;
          },
          onError: reject,
        });
      });

      // toast.success("Settings updated successfully!");

      // Clear the current settings data to force a refresh
      setCurrentSettingsData(null);
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings. Please try again.");
    }
  };

  return (
    <Main>
      {/* General Settings Configuration Section */}

      <Card className="p-4 gap-1 mb-6">
        <h1 className="text-2xl font-bold">General Application Settings</h1>
        <p className="text-muted-foreground">
          Configure general application preferences and system settings.
        </p>
      </Card>

      {/* Settings Configuration */}
      <div className="mb-2">
        <GeneralSettings
          onDataChange={handleDataChange}
          setSubmitFixedExpenseForm={setSubmitFixedExpenseForm}
          isFixedExpenseDirty={isFixedExpenseDirty}
          setIsFixedExpenseDirty={setIsFixedExpenseDirty}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSaveSettings}
          disabled={
            isLoading || /*!isFixedExpenseDirty ||*/ !currentSettingsData
          }
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <GeneralSettingsActionModal key={"general-settings-action-modal"} />
    </Main>
  );
};

export default GeneralSettingsPage;
