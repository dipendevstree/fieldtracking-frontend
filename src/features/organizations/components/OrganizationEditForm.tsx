import { useEffect, useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
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
import TreeSelect from "@/components/ui/multiTreeSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomButton from "@/components/shared/custom-button";
import { useGetOrganizationTypes } from "@/features/auth/Admin-sign-up/services/sign-up-services";
import {
  useGetEmployeeRange,
  useGetIndustry,
  useGetMenu,
} from "../services/organization.hook";
import { Country, State, City } from "country-state-city";
import type { ICountry, IState, ICity } from "country-state-city";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

// Schema for edit form (organization details only)
const editFormSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  industryId: z.string().min(1, "Industry is required"),
  organizationTypes: z.string().min(1, "organizationTypes is required"),
  employeeRangeId: z.string().min(1, "Employee range is required"),
  isSeparateSchema: z.boolean(),
  menuIds: z.array(z.string()).min(1, "At least one module must be selected"),
  website: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  state: z.string().optional(),
});

type TEditFormSchema = z.infer<typeof editFormSchema>;

interface Props {
  currentRow: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  onSubmit: (values: TEditFormSchema) => void;
}

export function OrganizationEditForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: Props) {
  const { data: employeeRangeList } = useGetEmployeeRange();
  const { data: industryList } = useGetIndustry();
  const { data: menuList } = useGetMenu();

  // State for country, state, and city dropdowns
  const [countries, setCountries] = useState<ICountry[]>([]);

  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const form = useForm<TEditFormSchema>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      organizationName: "",
      industryId: "",
      organizationTypes: "",
      employeeRangeId: "",
      isSeparateSchema: false,
      menuIds: [],
      website: "",
      description: "",
      address: "",
      country: "",
      city: "",
      zipCode: "",
      state: "",
    },
  });
  const { data: organizationTypesList } = useGetOrganizationTypes();
  const organizationTypes = useSelectOptions<any>({
    listData: organizationTypesList ?? [],
    labelKey: "organizationTypeName",
    valueKey: "organizationTypeId",
  });
  const { control, formState, reset, setValue, watch } = form;
  const { errors } = formState;

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  // Effect to load countries (defaulting to India if available, matching GeneralSetting)
  useEffect(() => {
    const india = Country.getAllCountries().find(
      (country) => country.name.toLowerCase() === "india",
    );
    if (india) {
      setCountries([india]);
    } else {
      setCountries(Country.getAllCountries());
    }
  }, []);

  // Effect to update states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countryData = Country.getCountryByCode(selectedCountry);
      setStates(State.getStatesOfCountry(countryData?.isoCode ?? ""));
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  // Effect to update cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateData = State.getStateByCodeAndCountry(
        selectedState,
        selectedCountry,
      );
      setCities(
        City.getCitiesOfState(selectedCountry, stateData?.isoCode ?? ""),
      );
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  const onSubmit = (values: any) => {
    onSubmitValues(values);
  };

  const onError = (error: any) => {
    console.log("Edit form validation error:", error);
  };

  const employeeRange = useSelectOptions<any>({
    listData: employeeRangeList ?? [],
    labelKey: "employeeRange",
    valueKey: "employeeRangeId",
  });

  const industry = useSelectOptions<any>({
    listData: industryList ?? [],
    labelKey: "industryName",
    valueKey: "industryId",
  });

  const buildTreeData = (menuList: any[]) => {
    if (!menuList || menuList.length === 0) return [];

    const map = new Map<string, any>();
    const tree: any[] = [];

    try {
      // Step 1: Initialize each node
      menuList.forEach((item) => {
        map.set(item.menuId, {
          title: item.menuName,
          value: item.menuId,
          key: item.menuId,
          children: [],
        });
      });

      // Step 2: Build parent-child relationships
      menuList.forEach((item) => {
        if (item.parentMenuId) {
          const parent = map.get(item.parentMenuId);
          if (parent) {
            parent.children.push(map.get(item.menuId));
          }
        } else {
          tree.push(map.get(item.menuId));
        }
      });

      // Step 3: Clean up empty children arrays
      const cleanChildren = (nodes: any[]) => {
        return nodes.map((node) => {
          const cleanedNode = { ...node };
          if (cleanedNode.children && cleanedNode.children.length > 0) {
            cleanedNode.children = cleanChildren(cleanedNode.children);
          } else {
            delete cleanedNode.children;
          }
          return cleanedNode;
        });
      };

      return cleanChildren(tree);
    } catch (error) {
      console.error("Error building tree data:", error);
      return [];
    }
  };

  const treeData = buildTreeData(menuList ?? []);

  // Initialize form values when editing - IMPROVED VERSION
  useEffect(() => {
    if (currentRow && open) {
      const editValues = {
        organizationName: currentRow.organizationName || currentRow.name || "",
        industryId: String(
          currentRow.industryId || currentRow.industry?.industryId || "",
        ),
        organizationTypes: String(currentRow.organizationTypeId || ""),
        employeeRangeId: String(
          currentRow.employeeRangeId ||
            currentRow.employeeRange?.employeeRangeId ||
            currentRow.employeeRang?.employeeRangeId ||
            "",
        ),
        isSeparateSchema:
          currentRow.isSeparateSchema || currentRow.is_separate_schema || false,
        menuIds: currentRow.menuIds || [],
        website: currentRow.website || "",
        description: currentRow.description || "",
        address: currentRow.address || "",
        country: currentRow.country || "",
        city: currentRow.city || "",
        zipCode: currentRow.zipCode || "",
        state: currentRow.state || "",
      };

      reset(editValues);
    }
  }, [currentRow, open, reset]);

  const handleDialogOpenChange = (state: boolean) => {
    if (!state) {
      // Reset form when closing dialog
      reset({
        organizationName: "",
        industryId: "",
        organizationTypes: "",
        employeeRangeId: "",
        isSeparateSchema: false,
        menuIds: [],
        website: "",
        description: "",
        address: "",
        country: "",
        city: "",
        zipCode: "",
        state: "",
      });
    }
    onOpenChange(state);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange} modal>
      <DialogContent className="max-h-[80vh] !max-w-4xl overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>
            Update organization details and configuration.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="edit-organization-form"
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-4 p-0.5"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Basic Organization Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Basic Information</h4>

                  {/* Organization Name */}
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">
                      Organization Name *
                    </Label>
                    <Controller
                      name="organizationName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="organizationName"
                          placeholder="Enter organization name"
                        />
                      )}
                    />
                    {errors.organizationName && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.organizationName.message}
                      </p>
                    )}
                  </div>

                  {/* Organization Type */}
                  <div className="space-y-2">
                    <Label htmlFor="organizationTypes">
                      Organization Type <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="organizationTypes"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="z-50 w-full">
                            {organizationTypes.map((option) => (
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
                    {errors.organizationTypes && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.organizationTypes.message}
                      </p>
                    )}
                  </div>

                  {/* Industry */}
                  <div className="space-y-2">
                    <Label htmlFor="industryId">Industry *</Label>
                    <Controller
                      name="industryId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent className="!w-full">
                            {industry.map((option) => (
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
                    {errors.industryId && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.industryId.message}
                      </p>
                    )}
                  </div>

                  {/* Employee Range */}
                  <div className="space-y-2">
                    <Label htmlFor="employeeRangeId">Employee Count *</Label>
                    <Controller
                      name="employeeRangeId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            {employeeRange.map((option) => (
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
                    {errors.employeeRangeId && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.employeeRangeId.message}
                      </p>
                    )}
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Controller
                      name="website"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="website"
                          placeholder="https://www.example.com"
                        />
                      )}
                    />
                    {errors.website && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.website.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="description"
                          placeholder="Brief description of the organization"
                        />
                      )}
                    />
                    {errors.description && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location & Configuration */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">
                    Location & Configuration
                  </h4>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="address"
                          placeholder="Street address"
                        />
                      )}
                    />
                  </div>

                  {/* Country & State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={countries.map((c) => ({
                              label: c.name,
                              value: c.isoCode,
                            }))}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              setValue("state", "");
                              setValue("city", "");
                            }}
                            placeholder="Select Country"
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={states.map((s) => ({
                              label: s.name,
                              value: s.isoCode,
                            }))}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              setValue("city", "");
                            }}
                            disabled={!selectedCountry || states.length === 0}
                            placeholder="Select State"
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* City & Zip Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={cities.map((c) => ({
                              label: c.name,
                              value: c.name,
                            }))}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={!selectedState || cities.length === 0}
                            placeholder="Select City"
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Controller
                        name="zipCode"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="zipCode"
                            placeholder="Zip code"
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Modules */}
                  <div className="space-y-2">
                    <Label htmlFor="modules">Modules *</Label>
                    <Controller
                      name="menuIds"
                      control={control}
                      render={({ field }) => (
                        <TreeSelect
                          treeData={treeData}
                          value={field.value || []}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          treeCheckable={true}
                          showCheckedStrategy="SHOW_ALL"
                          placeholder="Select modules"
                          className="w-full"
                          style={{ width: "100%" }}
                        />
                      )}
                    />
                    {errors.menuIds && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.menuIds.message}
                      </p>
                    )}
                  </div>

                  {/* Separate Schema Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="isSeparateSchema"
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <Checkbox
                          checked={value}
                          onCheckedChange={(checked) => onChange(!!checked)}
                          disabled
                          id="isSeparateSchema"
                          {...rest}
                        />
                      )}
                    />
                    <Label
                      htmlFor="isSeparateSchema"
                      className="text-sm font-normal"
                    >
                      Use separate schema for this organization
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <CustomButton
            type="submit"
            loading={loading}
            form="edit-organization-form"
          >
            Update Organization
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
