import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/stores/use-auth-store";
import {
  useGetDepartment,
  useGetOrganizationTypes,
} from "@/features/auth/Admin-sign-up/services/sign-up-services";
import { ConfirmDialog } from "@/components/confirm-dialog";
import currency from "../data/currency/currency.data";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useSelectOptions } from "@/hooks/use-select-option";
import parsePhoneNumberFromString from "libphonenumber-js";
import FixedDayExpenses from "./FixedDayExpenses";
import { Country, State, City } from "country-state-city";
import type { ICountry, IState, ICity } from "country-state-city";
import { CircleX } from "lucide-react";
import { useDirtyTracker } from "../../store/use-unsaved-changes-store";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { formatDropDownLabel } from "@/utils/commonFunction";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GeneralApplicationSettingsProps {
  onDataChange?: (data: any) => void;
  setSubmitFixedExpenseForm: Function;
  isFixedExpenseDirty: boolean;
  setIsFixedExpenseDirty: (isDirty: boolean) => void;
}

export default function GeneralApplicationSettings({
  onDataChange,
  setSubmitFixedExpenseForm,
  isFixedExpenseDirty,
  setIsFixedExpenseDirty,
}: GeneralApplicationSettingsProps) {
  const { user } = useAuth();
  const [autoExpenseApproval, setAutoExpenseApproval] = useState(false);
  const [fixedDayExpense, setFixedDayExpense] = useState<boolean>(false);
  const [allowAddUsersBasedOnTerritories, setAllowAddUsersBasedOnTerritories] =
    useState(false);
  const [allowWorkFromHome, setAllowWorkFromHome] = useState(false);
  const [enableAddLeaveAfterProbation, setEnableAddLeaveAfterProbation] =
    useState(false);
  const [addLeaveAfterProbationValue, setAddLeaveAfterProbationValue] =
    useState("");
  const [addLeaveAfterProbationUnit, setAddLeaveAfterProbationUnit] =
    useState("months");

  const [showTerritoryConfirm, setShowTerritoryConfirm] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    industryId: "",
    timezone: "",
    currency: "",
    website: "",
    description: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    dateFormat: "",
    distanceUnit: "",
    ratePerKm: "30",
    orgIcon: null,
    profileImage: null,
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    userPhoneNumber: "",
    userPhoneCode: "",
    userDepartment: "",
    userRole: "",
    userTier: "",
    // Flags to tell backend to remove existing files
    removeOrgIcon: false,
    removeProfileImage: false,
  });
  const [fileError, setFileError] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState<Record<string, string>>({});
  const [filePreview, setFilePreview] = useState<Record<string, string>>({});
  const orgIconInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  // State for country, state, and city dropdowns
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [initialState, setInitialState] = useState<any>(null);

  // Fetch organization types from API
  const {
    data: orgTypeList,
    isLoading: orgTypeLoading,
    error: orgTypeError,
  } = useGetOrganizationTypes();

  const { data: departmentList } = useGetDepartment();
  const department = useSelectOptions<any>({
    listData: departmentList ?? [],
    labelKey: "departmentName",
    valueKey: "departmentId",
  });

  const isLoading = !user;
  const hasError = false;

  // Update form data with organization data from user login
  useEffect(() => {
    if (user?.organization) {
      const org = user.organization;
      const newFormData = {
        organizationName: org.organizationName || "",
        organizationType: org.organizationTypeId || "",
        industryId: org.industryId || "",
        timezone: org.time_zone || "",
        currency: org.currency || "",
        website: org.website || "",
        description: org.description || "",
        streetAddress: org.address || "",
        city: org.city || "",
        state: org.state || "",
        zipCode: org.zipCode || "",
        country: org.country || "",
        dateFormat: "dd-mm-yyyy",
        distanceUnit: "kilometers",
        ratePerKm: org.rsPerKm?.toString() || "",
        orgIcon: null,
        profileImage: null,
        userFirstName: user?.firstName || "",
        userLastName: user?.lastName || "",
        userEmail: user?.email || "",
        userPhoneNumber: user?.phoneNumber || "",
        userPhoneCode: user?.countryCode || "",
        userDepartment: user?.departmentId || "",
        userRole: user?.role?.roleName || "",
        userTier: user?.role?.tierkey || "",
        userTerritory: user?.territoryId || "",
        // userShift: user?.shiftId || "",
        // userReportingTo:
        //   user?.reportingToUser[0].firstName +
        //     " " +
        //     user?.reportingToUser[0].lastName || "",
        removeOrgIcon: false,
        removeProfileImage: false,
      };
      setFileName((prev) => ({
        ...prev,
        userProfile: user?.profileUrl
          ? (user?.profileUrl.split("/")?.pop() as string)
          : "",
        orgIconFileName: user?.organization.organizationIcon
          ? (user?.organization.organizationIcon.split("/")?.pop() as string)
          : "",
      }));
      setFilePreview((prev) => ({
        ...prev,
        orgIconFileName: user?.organization.organizationIcon || "",
        userProfile: user?.profileUrl || "",
      }));
      setFormData(newFormData);
      setAutoExpenseApproval(org.isAutoExpense || false);
      setFixedDayExpense(org.isFixedDayExpense || false);
      setAllowAddUsersBasedOnTerritories(
        org.allowAddUsersBasedOnTerritories || false,
      );
      setAllowWorkFromHome(org.allowWorkFromHome || false);
      setEnableAddLeaveAfterProbation(org.isProbationPeriod || false);
      setAddLeaveAfterProbationValue(
        org.probationPeriodValue?.toString() || "",
      );
      setAddLeaveAfterProbationUnit(org.probationPeriodUnit || "months");

      // ✅  Capture the baseline state for dirty checking
      setInitialState({
        formData: newFormData,
        autoExpenseApproval: org.isAutoExpense || false,
        fixedDayExpense: org.isFixedDayExpense || false,
        allowAddUsersBasedOnTerritories:
          org.allowAddUsersBasedOnTerritories || false,
        allowWorkFromHome: org.allowWorkFromHome || false,
        enableAddLeaveAfterProbation: org.isProbationPeriod || false,
        addLeaveAfterProbationValue: org.probationPeriodValue?.toString() || "",
        addLeaveAfterProbationUnit: org.probationPeriodUnit || "months",
      });
    }
  }, [user]);

  // Effect to load all countries on component mount
  useEffect(() => {
    const india = Country.getAllCountries().find(
      (country) => country.name.toLowerCase() === "india",
    );
    if (india) {
      setCountries([india]);
    }
  }, []);

  // Effect to update states when country changes
  useEffect(() => {
    if (formData.country) {
      const countryData = Country.getCountryByCode(formData.country);
      setStates(State.getStatesOfCountry(countryData?.isoCode ?? ""));
    } else {
      setStates([]);
    }
  }, [formData.country]);

  // Effect to update cities when state changes
  useEffect(() => {
    if (formData.country && formData.state) {
      const stateData = State.getStateByCodeAndCountry(
        formData.state,
        formData.country,
      );
      setCities(
        City.getCitiesOfState(formData.country, stateData?.isoCode ?? ""),
      );
    } else {
      setCities([]);
    }
  }, [formData.country, formData.state]);

  // Notify parent component of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        ...formData,
        autoExpenseApproval,
        fixedDayExpense,
        allowAddUsersBasedOnTerritories,
        allowWorkFromHome,
        enableAddLeaveAfterProbation,
        addLeaveAfterProbationValue,
        addLeaveAfterProbationUnit,
        isFixedExpenseDirty,
      });
    }
  }, [
    formData,
    autoExpenseApproval,
    fixedDayExpense,
    allowAddUsersBasedOnTerritories,
    allowWorkFromHome,
    enableAddLeaveAfterProbation,
    addLeaveAfterProbationValue,
    addLeaveAfterProbationUnit,
    onDataChange,
    isFixedExpenseDirty,
  ]);

  const toggleApprovalCheckBox = (name: string, value: boolean) => {
    if (name === "autoExpenseApproval") {
      if (value || fixedDayExpense) {
        setAutoExpenseApproval(true);
        setFixedDayExpense(false);
        return;
      }
    } else if (name === "fixedDayExpense") {
      if (value || autoExpenseApproval) {
        setFixedDayExpense(true);
        setAutoExpenseApproval(false);
        return;
      }
    }
    setAutoExpenseApproval(false);
    setFixedDayExpense(false);
  };

  const handleInputChange = (field: string, value: File | string | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Common remove file helper for org icon and profile image
  const removeFile = (
    field: "orgIcon" | "profileImage",
    previewKey: string,
    fileNameKey: string,
    inputRef: React.RefObject<HTMLInputElement | null> | null,
    removeFlagKey: "removeOrgIcon" | "removeProfileImage",
  ) => {
    const preview = (filePreview as any)[previewKey] as string | undefined;
    try {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    } catch (e) {
      // ignore
    }
    // clear preview and filename
    setFilePreview((prev) => ({ ...prev, [previewKey]: "" }));
    setFileName((prev) => ({ ...prev, [fileNameKey]: "" }));
    // notify form that file is removed
    handleInputChange(field, null);
    setFormData((prev) => ({ ...prev, [removeFlagKey]: true }));
    if (inputRef && inputRef.current)
      (inputRef.current as HTMLInputElement).value = "";
  };

  const handleCountryChange = (countryCode: string) => {
    setFormData((prev) => ({
      ...prev,
      country: countryCode,
      state: "", // Reset state
      city: "", // Reset city
    }));
  };

  const handleStateChange = (stateCode: string) => {
    setFormData((prev) => ({
      ...prev,
      state: stateCode,
      city: "", // Reset city
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white shadow-sm">
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <Card className="bg-white shadow-sm">
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-500">
                Error loading settings. Please try again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Dirty Checking Logic ---
  const isDirty = useMemo(() => {
    if (!initialState) return false;

    // 1. Check Child Component (FixedDayExpenses)
    if (isFixedExpenseDirty) return true;

    // 2. Check Toggles & Values
    if (autoExpenseApproval !== initialState.autoExpenseApproval) return true;
    if (fixedDayExpense !== initialState.fixedDayExpense) return true;
    if (allowWorkFromHome !== initialState.allowWorkFromHome) return true;

    // Updated variable checks
    if (
      enableAddLeaveAfterProbation !== initialState.enableAddLeaveAfterProbation
    )
      return true;
    if (
      addLeaveAfterProbationValue !== initialState.addLeaveAfterProbationValue
    )
      return true;
    if (addLeaveAfterProbationUnit !== initialState.addLeaveAfterProbationUnit)
      return true;

    if (
      allowAddUsersBasedOnTerritories !==
      initialState.allowAddUsersBasedOnTerritories
    )
      return true;

    // 3. Check Files (New uploads or removals)
    // If a file object exists in state, user selected a new file
    if (formData.orgIcon !== null || formData.profileImage !== null)
      return true;
    // If remove flags are set
    if (formData.removeOrgIcon || formData.removeProfileImage) return true;

    // 4. Check Text Fields
    // We compare the JSON string of the text fields.
    // We exclude the file/flag keys from this comparison as they are handled above.
    const getDataPayload = (data: typeof formData) => {
      const {
        orgIcon,
        profileImage,
        removeOrgIcon,
        removeProfileImage, // Exclude these
        ...textFields
      } = data;
      return textFields;
    };

    const currentJson = JSON.stringify(getDataPayload(formData));
    const initialJson = JSON.stringify(getDataPayload(initialState.formData));

    return currentJson !== initialJson;
  }, [
    formData,
    autoExpenseApproval,
    fixedDayExpense,
    allowAddUsersBasedOnTerritories,
    allowWorkFromHome,
    enableAddLeaveAfterProbation,
    addLeaveAfterProbationValue,
    addLeaveAfterProbationUnit,
    initialState,
    isFixedExpenseDirty,
  ]);

  // ✅ SYNC WITH GLOBAL STORE
  useDirtyTracker(isDirty);

  const { showExitPrompt, confirmExit, cancelExit } =
    useUnsavedChanges(isDirty);

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={showExitPrompt}
        onOpenChange={cancelExit}
        title="Unsaved Changes"
        desc="You have unsaved changes. Are you sure you want to discard them? Your changes will be lost."
        confirmText="Discard Changes"
        cancelBtnText="Keep Editing"
        destructive={true}
        handleConfirm={confirmExit}
      />

      <Card className="bg-white shadow-sm">
        <CardContent>
          {/* Personal Information Section */}
          <div className="space-y-6 mb-10">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                Personal Information
              </h3>
            </div>

            {/* Row 1: First Name & Last Name */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={formData?.userFirstName}
                  name="firstName"
                  onChange={(e) =>
                    handleInputChange("userFirstName", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={formData?.userLastName}
                  name="lastName"
                  onChange={(e) =>
                    handleInputChange("userLastName", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Row 2: Email Address & Phone Number */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  placeholder="user@company.com"
                  type="email"
                  name="email"
                  value={formData?.userEmail}
                  onChange={(e) =>
                    handleInputChange("userEmail", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone
                </Label>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="IN"
                  name="phoneNumber"
                  value={
                    formData?.userPhoneCode + formData?.userPhoneNumber || ""
                  }
                  onChange={(value) => {
                    const phoneNumber = parsePhoneNumberFromString(value || "");
                    if (phoneNumber) {
                      handleInputChange(
                        "userPhoneCode",
                        `+${phoneNumber.countryCallingCode}`,
                      );
                      handleInputChange(
                        "userPhoneNumber",
                        phoneNumber.nationalNumber,
                      );
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            {/* Work Information Section */}
            <div className="space-y-4">
              {/* Row 3: Department & User Role */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="departmentId"
                    className="text-sm font-medium text-gray-700"
                  >
                    Department
                  </Label>
                  <Select
                    value={formData?.userDepartment}
                    onValueChange={(value) =>
                      handleInputChange("userDepartment", value)
                    }
                    disabled={true}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department..." />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {department.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={String(option.value)}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="org-icon"
                      className="text-sm font-medium text-gray-700"
                    >
                      Profile Image
                    </Label>
                    <input
                      ref={profileImageInputRef}
                      id="org-icon"
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml"
                      className="h-10 block w-full border border-gray-300 rounded-md px-3 py-2"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        setFileError((prev) => ({
                          ...prev,
                          userProfile: "",
                        }));
                        const file = e.target.files?.[0];
                        if (file) {
                          const validTypes = [
                            "image/png",
                            "image/jpeg",
                            "image/svg+xml",
                          ];
                          if (!validTypes.includes(file.type)) {
                            setFileError((prev) => ({
                              ...prev,
                              userProfile:
                                "Invalid file type. Please upload PNG, JPG, or SVG.",
                            }));
                            e.target.value = "";
                            setFileName((prev) => ({
                              ...prev,
                              userProfile: "",
                            }));
                          } else {
                            if (filePreview.userProfile)
                              URL.revokeObjectURL(filePreview.userProfile);
                            setFilePreview((prev) => ({
                              ...prev,
                              userProfile: URL.createObjectURL(file),
                            }));
                            setFileName((prev) => ({
                              ...prev,
                              userProfile: file.name,
                            }));
                            handleInputChange("profileImage", file);
                            // user selected a new profile image -> clear remove flag
                            setFormData((prev) => ({
                              ...prev,
                              removeProfileImage: false,
                            }));
                          }
                        } else {
                          setFileName((prev) => ({
                            ...prev,
                            userProfile: "",
                          }));
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="h-10 block w-full border border-gray-300 rounded-md px-3 py-2 text-left truncate"
                      onClick={() => profileImageInputRef.current?.click()}
                      title={`${fileName?.userProfile || "No file chosen"}`}
                    >
                      Choose file {fileName?.userProfile || "No file chosen"}
                    </button>
                    <p className="text-sm text-gray-600">
                      Upload your organization logo/icon (PNG, JPG, SVG)
                    </p>
                    {fileError?.userProfile && (
                      <p className="text-sm text-red-500">
                        {fileError.userProfile}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 flex flex-col justify-center items-center">
                    {filePreview?.userProfile ? (
                      <div className="flex items-center space-y-2">
                        <img
                          src={filePreview?.userProfile}
                          alt={fileName.userProfile}
                          className="size-25 border rounded-xl"
                        />
                        <div className="relative bottom-12 right-4">
                          <button
                            type="button"
                            className="text-sm text-red-600"
                            onClick={() =>
                              removeFile(
                                "profileImage",
                                "userProfile",
                                "userProfile",
                                profileImageInputRef,
                                "removeProfileImage",
                              )
                            }
                          >
                            <CircleX size={30} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      "No Preview Availble"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: User Role & Tier */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700"
                >
                  Role
                </Label>
                <Input
                  id="role"
                  placeholder="Enter role"
                  value={formatDropDownLabel(formData?.userRole)}
                  name="role"
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="tier"
                  className="text-sm font-medium text-gray-700"
                >
                  Tier
                </Label>
                <Input
                  id="tier"
                  placeholder="Enter tier"
                  value={formatDropDownLabel(formData?.userTier)}
                  name="tier"
                  onChange={(e) => handleInputChange("tier", e.target.value)}
                  disabled
                />
              </div>
            </div>

            {/* Row 5: Territory, Shift & Reporting To */}
            {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="territory"
                  className="text-sm font-medium text-gray-700"
                >
                  Territory
                </Label>
                <Input
                  id="territory"
                  placeholder="Enter territory"
                  value={formatDropDownLabel(formData?.userTerritory)}
                  name="territory"
                  onChange={(e) =>
                    handleInputChange("territory", e.target.value)
                  }
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="shift"
                  className="text-sm font-medium text-gray-700"
                >
                  Shift
                </Label>
                <Input
                  id="shift"
                  placeholder="Enter shift"
                  value={formatDropDownLabel(formData?.userShift)}
                  name="shift"
                  onChange={(e) => handleInputChange("shift", e.target.value)}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="reportingTo"
                  className="text-sm font-medium text-gray-700"
                >
                  Reporting To
                </Label>
                <Input
                  id="reportingTo"
                  placeholder="Enter reporting to"
                  value={formatDropDownLabel(formData?.userReportingTo)}
                  name="reportingTo"
                  onChange={(e) =>
                    handleInputChange("reportingTo", e.target.value)
                  }
                  disabled
                />
              </div>
            </div> */}
          </div>

          {user?.superAdminCreatedBy !== null && (
            <>
              <Separator className="my-8" />
              {/* Company Information Section */}
              <div className="space-y-6 mb-10">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Organization Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="company-name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Organization Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="company-name"
                      value={formData.organizationName}
                      onChange={(e) =>
                        handleInputChange("organizationName", e.target.value)
                      }
                      placeholder="Enter your organization name"
                      className="h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="timezone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Default Timezone <span className="text-red-500">*</span>
                      </Label>
                      {/* Set form user system timezone */}
                      <Select
                        value={formData.timezone}
                        onValueChange={(value) =>
                          handleInputChange("timezone", value)
                        }
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Select your system timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Ideally, populate this list dynamically from user system or backend */}
                          <SelectItem value="Asia/Calcutta">
                            Asia/Calcutta IST (+05:30)
                          </SelectItem>
                          <SelectItem value="America/New_York">
                            Eastern Time (EST)
                          </SelectItem>
                          <SelectItem value="America/Chicago">
                            Central Time (CST)
                          </SelectItem>
                          <SelectItem value="America/Denver">
                            Mountain Time (MST)
                          </SelectItem>
                          <SelectItem value="America/Los_Angeles">
                            Pacific Time (PST)
                          </SelectItem>
                          <SelectItem value="Europe/London">
                            GMT (London)
                          </SelectItem>
                          <SelectItem value="Europe/Paris">
                            CET (Paris)
                          </SelectItem>
                          <SelectItem value="Asia/Tokyo">
                            JST (Tokyo)
                          </SelectItem>
                          <SelectItem value="Australia/Sydney">
                            AEDT (Sydney)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="timezone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Default Currency <span className="text-red-500">*</span>
                      </Label>
                      {/* Set form user system timezone */}
                      <Select
                        value={formData.currency}
                        onValueChange={(value) =>
                          handleInputChange("currency", value)
                        }
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Select your system currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currency.map((c: any, index: number) => (
                            <SelectItem
                              key={index}
                              value={c.currency.symbol}
                            >{`${c.currency.name} (${c.currency.symbol})`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="org-type"
                      className="text-sm font-medium text-gray-700"
                    >
                      Organization Type <span className="text-red-500">*</span>
                    </Label>
                    {orgTypeLoading ? (
                      <div className="text-gray-500 text-sm">Loading...</div>
                    ) : orgTypeError ? (
                      <div className="text-red-500 text-sm">
                        Failed to load organization types
                      </div>
                    ) : (
                      <Select
                        value={formData.organizationType}
                        onValueChange={(value) =>
                          handleInputChange("organizationType", value)
                        }
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {orgTypeList?.map((type: any) => (
                            <SelectItem
                              key={
                                type.organizationTypeId || type.value || type.id
                              }
                              value={String(
                                type.organizationTypeId ||
                                  type.value ||
                                  type.id,
                              )}
                            >
                              {type.organizationTypeName ||
                                type.label ||
                                type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="website"
                      className="text-sm font-medium text-gray-700"
                    >
                      Website <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      placeholder="https://your-website.com"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700"
                    >
                      Organization Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Brief description of your organization..."
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                  {/* Organization Icon Upload Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="org-icon"
                        className="text-sm font-medium text-gray-700"
                      >
                        Organization Icon
                      </Label>
                      <input
                        ref={orgIconInputRef}
                        id="org-icon"
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml"
                        className="h-10 block w-full border border-gray-300 rounded-md px-3 py-2"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          setFileError((prev) => ({
                            ...prev,
                            orgIcon: "",
                          }));
                          const file = e.target.files?.[0];
                          if (file) {
                            const validTypes = [
                              "image/png",
                              "image/jpeg",
                              "image/svg+xml",
                            ];
                            if (!validTypes.includes(file.type)) {
                              setFileError((prev) => ({
                                ...prev,
                                orgIcon:
                                  "Invalid file type. Please upload PNG, JPG, or SVG.",
                              }));
                              e.target.value = "";
                              setFileName((prev) => ({
                                ...prev,
                                orgIconFileName: "",
                              }));
                            } else {
                              if (filePreview.orgIconFileName)
                                URL.revokeObjectURL(
                                  filePreview.orgIconFileName,
                                );
                              setFileName((prev) => ({
                                ...prev,
                                orgIconFileName: file.name,
                              }));
                              setFilePreview((prev) => ({
                                ...prev,
                                orgIconFileName: URL.createObjectURL(file),
                              }));
                              handleInputChange("orgIcon", file);
                              // user selected a new file -> not removing
                              setFormData((prev) => ({
                                ...prev,
                                removeOrgIcon: false,
                              }));
                            }
                          } else {
                            setFileName((prev) => ({
                              ...prev,
                              orgIconFileName: "",
                            }));
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="h-10 block w-full border border-gray-300 rounded-md px-3 py-2 text-left truncate"
                        onClick={() => orgIconInputRef.current?.click()}
                        title={`${fileName?.orgIconFileName || "No file chosen"}`}
                      >
                        Choose file{" "}
                        {fileName?.orgIconFileName || "No file chosen"}
                      </button>
                      <p className="text-sm text-gray-600">
                        Upload your organization logo/icon (PNG, JPG, SVG)
                      </p>
                      {fileError?.orgIcon && (
                        <p className="text-sm text-red-500">
                          {fileError.orgIcon}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 flex flex-col justify-center items-center">
                      {filePreview?.orgIconFileName ? (
                        <div className="flex items-center space-y-2">
                          <img
                            src={filePreview?.orgIconFileName}
                            alt={fileName?.orgIconFileName}
                            className="size-25 border rounded-xl"
                          />
                          <div className="relative bottom-12 right-4">
                            <button
                              type="button"
                              className="text-sm text-red-600"
                              onClick={() =>
                                removeFile(
                                  "orgIcon",
                                  "orgIconFileName",
                                  "orgIconFileName",
                                  orgIconInputRef,
                                  "removeOrgIcon",
                                )
                              }
                            >
                              <CircleX size={30} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        "No Preview Availble"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Address Information Section */}
              <div className="space-y-6 mb-10">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Address Information
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="street-address"
                      className="text-sm font-medium text-gray-700"
                    >
                      Street Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="street-address"
                      value={formData.streetAddress}
                      onChange={(e) =>
                        handleInputChange("streetAddress", e.target.value)
                      }
                      placeholder="Enter street address"
                      className="h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="country"
                        className="text-sm font-medium text-gray-700"
                      >
                        Country <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.country}
                        onValueChange={handleCountryChange}
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.isoCode}
                              value={country.isoCode}
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="state"
                        className="text-sm font-medium text-gray-700"
                      >
                        State/Province <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.state}
                        onValueChange={handleStateChange}
                        disabled={!formData.country || states.length === 0}
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Select state/province" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem
                              key={state.isoCode}
                              value={state.isoCode}
                            >
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="text-sm font-medium text-gray-700"
                      >
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) =>
                          handleInputChange("city", value)
                        }
                        disabled={!formData.state || cities.length === 0}
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="zip-code"
                        className="text-sm font-medium text-gray-700"
                      >
                        ZIP/Postal Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="zip-code"
                        value={formData.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                        placeholder="Enter ZIP or postal code"
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Allow to add Users based on Territories Section */}
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <Label className="text-lg font-medium text-gray-900">
                    Allow Users Based on Territories
                  </Label>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Switch
                          id="territory-users"
                          checked={allowAddUsersBasedOnTerritories}
                          disabled={allowAddUsersBasedOnTerritories}
                          onCheckedChange={(value) => {
                            if (value) {
                              setShowTerritoryConfirm(true);
                            }
                          }}
                        />
                      </div>
                    </TooltipTrigger>

                    {allowAddUsersBasedOnTerritories && (
                      <TooltipContent side="left">
                        Cannot be disabled as it affects existing records
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <Label className="text-lg font-medium text-gray-900">
                    Allow Users To Work From Home
                  </Label>
                </div>
                <Switch
                  id="work-from-home"
                  checked={allowWorkFromHome}
                  onCheckedChange={(value) => {
                    setAllowWorkFromHome(value);
                  }}
                />
              </div>

              <Separator className="my-6" />

              {/*  Add Leave Balance after Probation Period Section */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-lg font-medium text-gray-900">
                      Add Leave Balance after Probation Period
                    </Label>
                  </div>
                  <Switch
                    id="probation-period"
                    checked={enableAddLeaveAfterProbation}
                    onCheckedChange={(value: boolean) =>
                      setEnableAddLeaveAfterProbation(value)
                    }
                  />
                </div>

                {enableAddLeaveAfterProbation && (
                  <div className="mt-4 p-4 rounded-lg border bg-gray-50/50">
                    <div className="flex flex-wrap items-center gap-3">
                      <Label
                        htmlFor="probation-value"
                        className="text-sm font-medium text-gray-700 whitespace-nowrap"
                      >
                        Add Leave Balance after
                      </Label>

                      <div className="w-20">
                        <Input
                          id="probation-value"
                          value={addLeaveAfterProbationValue}
                          onChange={(e) =>
                            setAddLeaveAfterProbationValue(e.target.value)
                          }
                          placeholder="0"
                          type="number"
                          className="h-9 bg-white"
                        />
                      </div>

                      <div className="w-32">
                        <Select
                          value={addLeaveAfterProbationUnit}
                          onValueChange={setAddLeaveAfterProbationUnit}
                        >
                          <SelectTrigger className="h-9 w-full bg-white">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        of Probation Period
                      </Label>
                    </div>

                    {/* Validation Error Message */}
                    {addLeaveAfterProbationUnit === "months" &&
                      parseInt(addLeaveAfterProbationValue) > 12 && (
                        <p className="text-xs text-red-500 mt-2">
                          Maximum 12 months allowed
                        </p>
                      )}
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Auto-Expense Approval Section */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-lg font-medium text-gray-900">
                      Auto-Expense Approval
                    </Label>
                    <p className="text-sm text-gray-600">
                      {autoExpenseApproval
                        ? "Automatically approve expenses (Rate per KM is required)"
                        : "Manually approve expenses"}
                    </p>
                  </div>
                  <Switch
                    id="auto-expense"
                    checked={autoExpenseApproval}
                    onCheckedChange={(value: boolean) =>
                      toggleApprovalCheckBox("autoExpenseApproval", value)
                    }
                  />
                </div>

                {autoExpenseApproval && (
                  <div className="space-y-2 mt-4">
                    <Label
                      htmlFor="rate-per-km"
                      className="text-sm font-medium text-gray-700"
                    >
                      Rate Per KM ({user?.organization?.currency || "₹"})
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="rate-per-km"
                      value={formData.ratePerKm}
                      onChange={(e) =>
                        handleInputChange("ratePerKm", e.target.value)
                      }
                      placeholder="30"
                      className="w-32 h-10"
                      type="number"
                    />
                  </div>
                )}
              </div>

              {/* Fixed Day Expense Section */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-lg font-medium text-gray-900">
                      Fixed Day Expense
                    </Label>
                    <p className="text-sm text-gray-600">
                      {fixedDayExpense
                        ? "Fixed Daily Expense (Enter At Least One Fixed Expense)"
                        : "No Fixed Daily Expense"}
                    </p>
                  </div>
                  <Switch
                    id="auto-expense"
                    checked={fixedDayExpense}
                    onCheckedChange={(value: boolean) =>
                      toggleApprovalCheckBox("fixedDayExpense", value)
                    }
                  />
                </div>

                {fixedDayExpense && (
                  <FixedDayExpenses
                    setSubmitFixedExpenseForm={setSubmitFixedExpenseForm}
                    onDirtyStateChange={setIsFixedExpenseDirty}
                  />
                )}
              </div>
            </>
          )}

          <ConfirmDialog
            open={showTerritoryConfirm}
            onOpenChange={setShowTerritoryConfirm}
            title={
              <span className="text-destructive">
                <IconAlertTriangle
                  className="stroke-destructive mr-1 inline-block"
                  size={18}
                />{" "}
                <span>Warning: Enable Territory-Based Users?</span>
              </span>
            }
            desc={
              <div className="space-y-4">
                <p className="mb-2">
                  Enabling Territory-Based Users will permanently apply
                  territory restrictions to existing users and related records.
                </p>
                <Alert variant="destructive">
                  <AlertTitle>Warning!</AlertTitle>
                  <AlertDescription>
                    Once this setting is enabled, it cannot be disabled as it
                    may impact existing user records and system configurations.
                    Please proceed carefully.
                  </AlertDescription>
                </Alert>
              </div>
            }
            destructive
            handleConfirm={() => {
              setAllowAddUsersBasedOnTerritories(true); // apply toggle
              setShowTerritoryConfirm(false); // close dialog
            }}
            cancelBtnText="Cancel"
            confirmText="Yes, Enable"
          />
        </CardContent>
      </Card>
    </div>
  );
}
