import { Main } from "@/components/layout/main";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/stores/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { formSchema, LeaveApprovalsFormSchema } from "./data/schema";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useGetAllTerritoriesForDropdown } from "@/features/userterritory/services/user-territory.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import {
  useCreateLeaveApprovals,
  useGetLeaveApprovals,
} from "./services/leaveApprovals.hook";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useGetAllUsers } from "@/features/UserManagement/services/AllUsers.hook";
import { useGetAllTiers } from "../Approvers/services/approvers.hook";
import { useEffect, useMemo, useState } from "react";
import { ApprovalRole } from "./type/type";
import { formatDropDownLabel } from "@/utils/commonFunction";
import { PermissionGate } from "@/permissions/components/PermissionGate";

export default function LeaveApprovals() {
  const { user } = useAuthStore();
  const { data: territories = [], isLoading: isTerritoriesLoading } =
    useGetAllTerritoriesForDropdown();
  const allowAddUsersBasedOnTerritories =
    user?.organization?.allowAddUsersBasedOnTerritories;

  // Track selected territory for API calls
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string>(
    allowAddUsersBasedOnTerritories ? user?.territoryId || "" : ""
  );

  const {
    data: leaveApprovalsConfig = [],
    isLoading: isLeaveApprovalsLoading,
  } = useGetLeaveApprovals({
    territoryId: allowAddUsersBasedOnTerritories ? selectedTerritoryId : "",
  });

  const {
    mutate: createLeaveApprovals,
    isPending: isCreateLeaveApprovalsLoading,
  } = useCreateLeaveApprovals();

  // Get all user tiers for dropdown
  const { data: userTiers = [], isLoading: isTiersLoading } = useGetAllTiers();

  // Get all users for dropdown
  const { allUsers = [], isLoading: isUsersLoading } = useGetAllUsers({
    territoryId: selectedTerritoryId || null,
  });

  const territoryOptions = useSelectOptions<any>({
    listData: territories,
    valueKey: "id",
    labelKey: "name",
  }).map((t) => ({ ...t, value: String(t.value) }));

  // Tier options from user tiers
  const tierOptions = useSelectOptions<any>({
    listData: userTiers.map((t: any) => ({
      id: t,
      name: formatDropDownLabel(t),
    })),
    valueKey: "id",
    labelKey: "name",
  }).map((t) => ({ ...t, value: String(t.value) }));

  // User options for dropdown
  const userOptions = useSelectOptions<any>({
    listData: allUsers.map((u: any) => ({
      ...u,
      fullName: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
    })),
    valueKey: "id",
    labelKey: "fullName",
  }).map((u) => ({ ...u, value: String(u.value) }));

  const approvalRoleOptions = useSelectOptions<any>({
    listData: Object.values(ApprovalRole).map((role) => ({
      value: role,
      label: formatDropDownLabel(role),
    })),
    valueKey: "value",
    labelKey: "label",
  }).map((t) => ({ ...t, value: String(t.value) }));

  const form = useForm<LeaveApprovalsFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      territoryId: user?.territoryId || "",
      approvalRole: "",
      userId: "",
      tierEnabled: false,
      leaveApprovalsLevels: [],
    },
  });

  const selectedTerritory = form.watch("territoryId");
  const selectedApprovalRole = form.watch("approvalRole");

  const { fields } = useFieldArray({
    control: form.control,
    name: "leaveApprovalsLevels",
  });

  const tierWiseUserCache = useMemo(() => {
    if (userTiers.length === 0) return {};
    const tierWiseUserCache: { [key: string]: any } = {};
    userTiers.forEach((tier: any) => {
      tierWiseUserCache[tier] = allUsers.filter((user: any) => {
        user.fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
        return user.role.tierkey === tier;
      });
    });
    return tierWiseUserCache;
  }, [allUsers, selectedTerritory]);

  useEffect(() => {
    if (!isLeaveApprovalsLoading) {
      const defaultLeaveApprovalsLevels =
        userTiers.length > 0
          ? userTiers
              .filter((tier: any) => {
                const userExists = tierWiseUserCache[tier] || [];
                return userExists.length ? true : false;
              })
              .map((tier: any) => ({
                tierkey: tier,
                approvalRole: "",
                userId: "",
              }))
          : [];
      if (leaveApprovalsConfig) {
        const leaveApprovalsLevels: any = [];
        defaultLeaveApprovalsLevels.forEach((tier: any) => {
          const tierExists = leaveApprovalsConfig.leaveApprovalsLevels?.find(
            (level: any) => level.tierkey === tier.tierkey
          );
          const userExists = tierWiseUserCache[tier.tierkey] || [];
          if (!userExists.length) {
            return;
          }
          leaveApprovalsLevels.push({
            ...(tierExists ? { leaveApprovalsLevelId: tierExists.id } : {}),
            tierkey: tier.tierkey,
            approvalRole: tierExists?.approvalRole ?? "",
            userId: tierExists?.userId ?? "",
          });
        });
        form.reset({
          territoryId: selectedTerritoryId, // Preserve the currently selected territory
          tierEnabled: leaveApprovalsConfig.tierEnabled ?? false,
          approvalRole: leaveApprovalsConfig.approvalRole ?? "",
          userId: leaveApprovalsConfig.userId ?? "",
          leaveApprovalsLevels: leaveApprovalsLevels,
        });
      } else {
        form.reset({
          territoryId: selectedTerritoryId, // Preserve the currently selected territory
          tierEnabled: false,
          approvalRole: "",
          userId: "",
          leaveApprovalsLevels: defaultLeaveApprovalsLevels,
        });
      }
    }
  }, [
    leaveApprovalsConfig,
    isLeaveApprovalsLoading,
    form,
    selectedTerritoryId,
  ]);

  const tierEnabled = form.watch("tierEnabled");

  const isDataReady =
    !isLeaveApprovalsLoading &&
    !isTiersLoading &&
    !isTerritoriesLoading &&
    !isUsersLoading &&
    (!allowAddUsersBasedOnTerritories || !!selectedTerritory);

  const onSubmit = (data: LeaveApprovalsFormSchema) => {
    console.log(data);

    if (!isDataReady) {
      return;
    }

    let payload = {
      territoryId: data.territoryId || null,
      tierEnabled: data.tierEnabled,
      approvalRole: data.tierEnabled ? null : data.approvalRole || null,
      userId: data.tierEnabled
        ? null
        : data.approvalRole === ApprovalRole.reporting_to
          ? null
          : data.userId || null,
      leaveApprovalsLevels: data.tierEnabled
        ? data.leaveApprovalsLevels?.map((level: any) => ({
            leaveApprovalsLevelId: level.leaveApprovalsLevelId || null,
            tierkey: level.tierkey,
            approvalRole: level.approvalRole || null,
            userId: level.userId || null,
          }))
        : [],
    };
    createLeaveApprovals(payload);
  };

  if (!isDataReady) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading configuration...
      </div>
    );
  }
  console.log("error", form.formState.errors);
  const rowError = !Array.isArray(form.formState.errors.leaveApprovalsLevels)
    ? form.formState.errors.leaveApprovalsLevels?.message
    : null;
  return (
    <Main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          {/* Header Section */}
          <div className="border-b bg-card p-4 border rounded-lg shadow mb-5">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">
                  Leave Approvers Configuration
                </h1>
                <p className="text-muted-foreground">
                  Configure leave approvers for different territories.
                </p>
              </div>
              <div className="flex items-center gap-4">
                {allowAddUsersBasedOnTerritories && (
                  <div className="w-64">
                    <FormField
                      control={form.control}
                      name="territoryId"
                      render={({ field }) => (
                        <FormItem>
                          <SearchableSelect
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              setSelectedTerritoryId(value as string);
                            }}
                            placeholder="Select Territory"
                            options={territoryOptions}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Leave Approvers Configuration Box */}
          <div className="bg-card border rounded-lg shadow">
            {/* Header with Tier Switch */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                Leave Approvers Configuration
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Tier:</span>
                <FormField
                  control={form.control}
                  name="tierEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Content based on Tier Switch */}
            <div className="p-4">
              {!tierEnabled ? (
                /* Tier OFF: Show Approval Role and User fields inline */
                <div className="flex items-start gap-4">
                  <div className="flex-1 max-w-xs">
                    <FormField
                      control={form.control}
                      name="approvalRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Approval Role</FormLabel>
                          <FormControl>
                            <SearchableSelect
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select Approval Role"
                              options={approvalRoleOptions}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {selectedApprovalRole &&
                    selectedApprovalRole !== ApprovalRole.reporting_to && (
                      <div className="flex-1 max-w-xs">
                        <FormField
                          control={form.control}
                          name="userId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select User</FormLabel>
                              <FormControl>
                                <SearchableSelect
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="Select User"
                                  options={userOptions}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                </div>
              ) : (
                /* Tier ON: Show Accordion-style Table */
                <div className="space-y-4">
                  {/* Table */}
                  <div className="border rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-[1fr_3fr_3fr_auto] gap-4 p-3 bg-muted/50 border-b font-medium text-sm">
                      <div>Tier</div>
                      <div>Approval Role</div>
                      <div>User</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y">
                      {fields.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          No tier exists.
                        </div>
                      ) : (
                        fields.map((field, index) => {
                          const tierWiseUser = allUsers.filter((user: any) => {
                            user.fullName =
                              `${user.firstName || ""} ${user.lastName || ""}`.trim();
                            return user.role.tierkey === field.tierkey;
                          });

                          // if no user found for tier
                          if (tierWiseUser.length === 0) {
                            return null;
                          }

                          const userOptions = tierWiseUser.map((u: any) => ({
                            label: u.fullName,
                            value: String(u.id),
                          }));

                          return (
                            <div
                              key={field.id}
                              className="grid grid-cols-[1fr_3fr_3fr_auto] gap-4 p-3 items-start"
                            >
                              {/* Tier */}
                              <div className="hidden">
                                <FormField
                                  control={form.control}
                                  name={`leaveApprovalsLevels.${index}.tierkey`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <SearchableSelect
                                          value={field.value}
                                          onChange={field.onChange}
                                          placeholder="Select Tier"
                                          options={tierOptions}
                                          disabled
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div>
                                {formatDropDownLabel(field.tierkey as string)}
                              </div>

                              {/* Approval Role */}
                              <FormField
                                control={form.control}
                                name={`leaveApprovalsLevels.${index}.approvalRole`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <SearchableSelect
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Select Role"
                                        options={approvalRoleOptions}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* User */}
                              {form.watch(
                                `leaveApprovalsLevels.${index}.approvalRole`
                              ) !== ApprovalRole.reporting_to && (
                                <FormField
                                  control={form.control}
                                  name={`leaveApprovalsLevels.${index}.userId`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <SearchableSelect
                                          value={field.value}
                                          onChange={field.onChange}
                                          placeholder="Select User"
                                          options={userOptions}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  {rowError && <span className="text-red-500">{rowError}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <PermissionGate requiredPermission="leave_approvals" action="edit">
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                disabled={
                  isCreateLeaveApprovalsLoading || !form.formState.isDirty
                }
              >
                Save Configuration
              </Button>
            </div>
          </PermissionGate>
        </form>
      </Form>
    </Main>
  );
}
