import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import parsePhoneNumberFromString from "libphonenumber-js";
import { AlertCircle } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useSelectOptions } from "@/hooks/use-select-option";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomButton from "@/components/shared/custom-button";
import { useGetDepartment } from "@/features/auth/Admin-sign-up/services/sign-up-services";
import { useGetUsersForDropdown } from "@/features/buyers/services/users.hook";
import { useGetAllTerritoriesForDropdown } from "@/features/userterritory/services/user-territory.hook";
import { formSchema, TFormSchema } from "../data/schema";
import { useGetAllRolesForDropdown } from "../services/Roles.hook";

interface Props {
  currentRow?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  onSubmit: (values: TFormSchema) => void;
}

export function UserActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: Props) {
  const isEdit = !!currentRow;

  const { data: rolesList } = useGetAllRolesForDropdown();

  // Initialize selectedRoleId with current row's reportingToRoleId for edit mode
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    currentRow?.reportingToRoleId || ""
  );

  const { data: userList = [] } = useGetUsersForDropdown({
    roleId: selectedRoleId,
    enabled: !!selectedRoleId,
  });

  // Filter out current user from the user list to prevent self-reporting
  const filteredUserList = userList.filter((user: any) =>
    currentRow?.id ? String(user.id) !== String(currentRow.id) : true
  );

  const enhancedUserList = filteredUserList.map((user: any) => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  }));

  const roles = useSelectOptions<any>({
    listData: rolesList ?? [],
    labelKey: "roleName",
    valueKey: "roleId",
  });

  const users = useSelectOptions<any>({
    listData: enhancedUserList,
    labelKey: "fullName",
    valueKey: "id",
  });

  const { data: territoriesList } = useGetAllTerritoriesForDropdown();
  const territories = useSelectOptions<any>({
    listData: territoriesList ?? [],
    labelKey: "name",
    valueKey: "id",
  });
  const { data: departmentList } = useGetDepartment();
  const department = useSelectOptions<any>({
    listData: departmentList ?? [],
    labelKey: "departmentName",
    valueKey: "departmentId",
  });
  const tiers = [
    { label: "Tier 1", value: "tier_1" },
    { label: "Tier 2", value: "tier_2" },
    { label: "Tier 3", value: "tier_3" },
    { label: "Tier 4", value: "tier_4" },
    { label: "Tier 5", value: "tier_5" },
    { label: "Tier 6", value: "tier_6" },
    { label: "Tier 7", value: "tier_7" },
    { label: "Tier 8", value: "tier_8" },
    { label: "Tier 9", value: "tier_9" },
    { label: "Tier 10", value: "tier_10" },
  ];
  const formatPhoneToE164 = (phone: string, countryCode: string) => {
    if (!phone) return "";

    // If phone already includes country code, return as is
    if (phone.startsWith("+")) return phone;

    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");

    // If no country code provided, default to +1
    const defaultCountryCode = countryCode || "+1";

    // Combine country code with phone number
    return `${defaultCountryCode}${cleanPhone}`;
  };
  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: currentRow?.id ?? "",
      firstName: currentRow?.firstName ?? "",
      lastName: currentRow?.lastName ?? "",
      email: currentRow?.email ?? "",
      phoneNumber: formatPhoneToE164(
        currentRow?.phoneNumber || "",
        currentRow?.countryCode || "+91"
      ),
      territoryId: currentRow?.territoryId ?? "",
      roleId: currentRow?.roleId ?? "",
      countryCode: currentRow?.countryCode ?? "+91",
      permissions: currentRow?.permissions ?? [],
      isWebUser: currentRow?.isWebUser ?? false,
      departmentId: currentRow?.departmentId,
      reportingToRoleId: currentRow?.reportingToRoleId,
      tierkey: currentRow?.tierkey,
      reportingToIds: [],
    },
  });

  const onError = (error: any) => {
    console.log("Form validation error:", error);
  };

  const {
    control,
    reset,
    formState: { errors },
    setValue,
  } = form;

  useEffect(() => {
    if (currentRow && open) {
      const reportingRoleId = currentRow.reportingToRoleId;
      if (reportingRoleId) {
        setSelectedRoleId(reportingRoleId);
      }

      const formattedPhone = formatPhoneToE164(
        currentRow.phoneNumber || "",
        currentRow.countryCode || "+91"
      );

      // Process reportingToIds properly for the form
      let processedReportingToIds = [];

      console.log("=== EDIT MODE DEBUG ===");
      console.log("currentRow:", currentRow);
      console.log("currentRow.reportingToIds:", currentRow.reportingToIds);
      console.log("currentRow.reportingTo:", currentRow.reportingTo);

      if (Array.isArray(currentRow.reportingToIds)) {
        // If it's already an array, check if it contains user objects or just IDs
        if (
          currentRow.reportingToIds.length > 0 &&
          typeof currentRow.reportingToIds[0] === "object"
        ) {
          // Extract IDs from user objects
          processedReportingToIds = currentRow.reportingToIds.map((user: any) =>
            String(user.id || user.userId || user.userID)
          );
        } else {
          // It's already an array of IDs
          processedReportingToIds = currentRow.reportingToIds.map(String);
        }
      } else if (currentRow.reportingToIds) {
        // If it's a single ID
        processedReportingToIds = [String(currentRow.reportingToIds)];
      } else if (Array.isArray(currentRow.reportingTo)) {
        // If we have reportingTo objects, extract IDs
        processedReportingToIds = currentRow.reportingTo.map((user: any) =>
          String(user.id || user.userId || user.userID)
        );
      } else if (
        currentRow.reportingTo &&
        typeof currentRow.reportingTo === "object"
      ) {
        // If it's a single reportingTo object
        processedReportingToIds = [
          String(
            currentRow.reportingTo.id ||
              currentRow.reportingTo.userId ||
              currentRow.reportingTo.userID
          ),
        ];
      }

      console.log("processedReportingToIds:", processedReportingToIds);

      reset({
        id: currentRow.id ?? "",
        firstName: currentRow.firstName ?? "",
        lastName: currentRow.lastName ?? "",
        email: currentRow.email ?? "",
        phoneNumber: formattedPhone,
        territoryId: currentRow.territoryId ?? "",
        roleId: currentRow.roleId ?? "",
        countryCode: currentRow.countryCode ?? "+91",
        permissions: currentRow.permissions ?? [],
        isWebUser: currentRow.isWebUser ?? false,
        departmentId: currentRow.departmentId,
        reportingToRoleId: currentRow.reportingToRoleId,
        tierkey: currentRow.tierkey,
        reportingToIds: processedReportingToIds,
      });
    }
  }, [currentRow, open, reset]);

  const onSubmit = (values: any) => {
    console.log("Form submit values:", values); // Debug log
    console.log(
      "reportingToIds type:",
      typeof values.reportingToIds,
      values.reportingToIds
    ); // Debug log
    onSubmitValues(values);
  };

  const handleDialogChange = (state: boolean) => {
    if (!state) {
      reset();
      setSelectedRoleId(""); // Reset selected role ID
    }
    onOpenChange(state);
  };

  const getFieldValue = (value: any): string => {
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }
    return "";
  };

  // console.log('selectedValues', selectedValues)

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[80vh] !max-w-4xl overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              {isEdit ? "Edit User" : "Add New User / Sales Rep"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              {isEdit
                ? "Update user information and territory assignment."
                : "Create a new user account with appropriate permissions and territory assignment."}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id="user-form"
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-6"
          >
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="border-b pb-2 text-lg font-medium">
                Personal Information
              </h3>

              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="firstName"
                        placeholder="Enter first name"
                        value={getFieldValue(field.value)}
                      />
                    )}
                  />
                  {errors.firstName && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="lastName"
                        placeholder="Enter last name"
                        value={getFieldValue(field.value)}
                      />
                    )}
                  />
                  {errors.lastName && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Email Address & Phone Number */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="email"
                        placeholder="user@company.com"
                        type="email"
                        value={getFieldValue(field.value)}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone</Label>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="IN"
                        value={field.value || ""}
                        onChange={(value) => {
                          field.onChange(value || "");
                          const phoneNumber = parsePhoneNumberFromString(
                            value || ""
                          );
                          if (phoneNumber) {
                            setValue(
                              "countryCode",
                              `+${phoneNumber.countryCallingCode}`,
                              {
                                shouldValidate: true,
                                shouldDirty: true,
                              }
                            );
                          } else {
                            setValue("countryCode", "+91", {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    )}
                  />
                  {errors.phoneNumber && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Work Information Section */}
            <div className="space-y-4">
              {/* Row 3: Department & User Role */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="departmentId">Department</Label>
                  <Controller
                    name="departmentId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={getFieldValue(field.value)}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select department..." />
                        </SelectTrigger>
                        <SelectContent className="!w-full">
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
                    )}
                  />
                  {errors.departmentId && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.departmentId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roleId">
                    User Role <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="roleId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={getFieldValue(field.value)}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role..." />
                        </SelectTrigger>
                        <SelectContent className="!w-full">
                          {roles.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={String(option.value)}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.roleId && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.roleId.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: Territory & User Tier */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="territoryId">
                    Territory <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="territoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={getFieldValue(field.value)}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select territories..." />
                        </SelectTrigger>
                        <SelectContent className="!w-full">
                          {territories.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={String(option.value)}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.territoryId && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.territoryId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tierkey">
                    User Tier <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="tierkey"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={getFieldValue(field.value)}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select User Tier..." />
                        </SelectTrigger>
                        <SelectContent className="!w-full">
                          {tiers.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={String(option.value)}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.tierkey && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.tierkey.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Reporting Structure Section */}
            <div className="space-y-4">
              {/* Row 5: Reporting To Role & Reporting To Users */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reportingToRoleId">
                    Reporting To Role <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="reportingToRoleId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={getFieldValue(field.value)}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedRoleId(value);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role..." />
                        </SelectTrigger>
                        <SelectContent className="!w-full">
                          {roles.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={String(option.value)}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.reportingToRoleId && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.reportingToRoleId.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportingToIds">
                    Reporting To User<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="reportingToIds"
                    control={control}
                    render={({ field }) => {
                      const currentValue = Array.isArray(field.value)
                        ? field.value[0]
                        : field.value;
                      const displayValue = currentValue
                        ? String(currentValue)
                        : "";

                      console.log("=== SELECT RENDER DEBUG ===");
                      console.log("field.value:", field.value);
                      console.log("currentValue:", currentValue);
                      console.log("displayValue:", displayValue);
                      console.log(
                        "available users:",
                        users.map((u) => ({ id: u.value, name: u.label }))
                      );

                      return (
                        <Select
                          value={displayValue}
                          onValueChange={(value) => {
                            console.log("Select onChange with value:", value);
                            field.onChange([value]); // Always store as array
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select user..." />
                          </SelectTrigger>
                          <SelectContent className="!w-full">
                            {users.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={String(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  {errors.reportingToIds && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.reportingToIds.message}
                    </p>
                  )}
                </div>

                {/* <div className='space-y-2'>
                  <Label htmlFor='reportingToIds'>
                    Reporting To <span className='text-red-500'>*</span>
                  </Label>
                  <Controller
                    name='reportingToIds'
                    control={control}
                    render={({ field }) => {
                      console.log('field', field)
                      const [open, setOpen] = useState(false)
                      const selectedValues: string[] = (field.value || []).map(
                        String
                      )
                      console.log('selectedValues', selectedValues)

                      const toggleSelection = (value: any) => {
                        const stringValue = String(value)
                        const newSelection = selectedValues.includes(
                          stringValue
                        )
                          ? selectedValues.filter(
                              (item: string) => item !== stringValue
                            )
                          : [...selectedValues, stringValue]
                        field.onChange(newSelection)
                      }

                      const removeSelection = (valueToRemove: any) => {
                        const stringValueToRemove = String(valueToRemove)
                        field.onChange(
                          selectedValues.filter(
                            (item: string) => item !== stringValueToRemove
                          )
                        )
                      }

                      const selectedOptions = users
                        .filter((option) =>
                          selectedValues.includes(String(option.value))
                        )
                        .map((option) => ({
                          value: String(option.value),
                          label: option.label,
                        }))

                      return (
                        <MultiSelect open={open} onOpenChange={setOpen}>
                          <MultiSelectTrigger className='w-full'>
                            <MultiSelectValue
                              placeholder='Select users...'
                              selectedItems={selectedOptions}
                              onRemove={removeSelection}
                            />
                          </MultiSelectTrigger>
                          <MultiSelectContent>
                            {users.map((option) => (
                              <MultiSelectItem
                                key={option.value}
                                selected={selectedValues.includes(
                                  String(option.value)
                                )}
                                onSelect={() => toggleSelection(option.value)}
                              >
                                {option.label}
                              </MultiSelectItem>
                            ))}
                          </MultiSelectContent>
                        </MultiSelect>
                      )
                    }}
                  />
                  {errors.reportingToIds && (
                    <p className='flex items-center gap-1 text-xs text-red-500'>
                      <AlertCircle className='h-3 w-3' />
                      {errors.reportingToIds.message}
                    </p>
                  )}
                </div> */}
              </div>
            </div>

            {/* Settings Section */}
            <div className="space-y-4">
              {/* Row 6: Active Role Checkbox (takes full width or can be paired with another field) */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Controller
                    name="isWebUser"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          className="border"
                          id="isWebUser"
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                        <Label
                          htmlFor="isWebUser"
                          className="cursor-pointer text-sm"
                        >
                          Is web user
                        </Label>
                      </div>
                    )}
                  />
                </div>
                <div></div>
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter className="flex gap-2 border-t pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <CustomButton type="submit" loading={loading} form="user-form">
            {isEdit ? "Update User" : "Create User"}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
