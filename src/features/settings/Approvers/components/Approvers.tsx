import { useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  UseFormWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { EXPENSE_TYPE, TIER } from "@/data/app.data";
import { formatExpenseType } from "@/utils/commonFormatters";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  useCreateApprovalsLevel,
  useDeleteApprovalsLevel,
  useGetAllApprovalsLevel,
  useGetAllRolesForDropdownList,
  useGetUsersDropDownList,
  useUpdateApprovalsLevel,
  useUpdateOrganization,
} from "../services/approvers.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { formSchema, FormValues } from "../data/approvalLevelSchema";
import { Card } from "@/components/ui/card";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import { useAuthStore } from "@/stores/use-auth-store";

// State to manage information for the delete modal
interface DeletionState {
  onConfirm: () => void;
  itemName: string;
  itemIdentifierValue: string;
}

// ----------- Main Approvers Component -------------
export default function Approvers() {
  const { data: allApprovalsLevelList = {}, isLoading } =
    useGetAllApprovalsLevel();

  const { user, updateUser } = useAuthStore();
  const onSuccess = (data: any) => {
    updateUser({
      organization: data,
    });
  };
  const { mutate: updateOrganization } = useUpdateOrganization(
    user?.organizationID ?? "",
    onSuccess
  );

  const { mutate: createApprovalLevel, isPending: isCreating } =
    useCreateApprovalsLevel();
  const { mutate: updateApprovalLevel, isPending: isUpdating } =
    useUpdateApprovalsLevel();
  const { mutate: deleteApprovalLevel, isPending: isDeleting } =
    useDeleteApprovalsLevel();

  // Combined processing state for the main Save button
  const isProcessing = isCreating || isUpdating;

  // State for the delete confirmation modal
  const [deletionState, setDeletionState] = useState<DeletionState | null>(
    null
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultApprover: "",
      selectedUser: "",
      levels: [],
    },
  });

  const { allRoles: allRolesList } = useGetAllRolesForDropdownList();
  const roleId = watch("defaultApprover");
  const { listData: userListDropDownDataforLevel = [] } =
    useGetUsersDropDownList({ roleId, enabled: true });
  const { listData: userListDropDownForExpenseTypes = [] } =
    useGetUsersDropDownList();

  const {
    fields: levelFields,
    append: addLevel,
    remove: removeLevel,
  } = useFieldArray({ control, name: "levels" });

  // Select options generation
  const userListDropDownListForLevels = userListDropDownDataforLevel?.map(
    (user: any) => ({
      ...user,
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    })
  );
  const userListDropDownListForExpenseTypes =
    userListDropDownForExpenseTypes?.map((user: any) => ({
      ...user,
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    }));
  const rolesOptions = useSelectOptions({
    listData: allRolesList,
    labelKey: "roleName",
    valueKey: "roleId",
  });
  const usersOptionsForLevels = useSelectOptions<any>({
    listData: userListDropDownListForLevels,
    labelKey: "fullName",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));
  const usersOptionsForExpanseTypes = useSelectOptions<any>({
    listData: userListDropDownListForExpenseTypes,
    labelKey: "fullName",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));
  const tierOptions = Object.entries(TIER).map(([key, value]) => ({
    label: key.replace("TIER_", "Tier "),
    value,
  }));
  const expanseTypeOptions = Object.entries(EXPENSE_TYPE).map(
    ([key, value]) => ({ label: formatExpenseType(key), value })
  );

  // ----------- Prefill Data from API -------------
  useEffect(() => {
    if (
      !isLoading &&
      allApprovalsLevelList &&
      Object.keys(allApprovalsLevelList).length
    ) {
      const prefilledLevels = Object.entries(allApprovalsLevelList).map(
        ([userId, records]) => {
          const expenseTypes = (Array.isArray(records) ? records : []).map(
            (rec) => ({
              expensesLevelId: rec.id,
              type: rec.expenseType,
              tier: rec.tierkey,
              minAmount: String(rec.minAmount),
              maxAmount: String(rec.maxAmount),
            })
          );
          return { user: userId, expenseTypes };
        }
      );
      reset({
        defaultApprover:
          user?.organization?.defaultExpensesApprovalRoleId ?? "",
        selectedUser: user?.organization?.defaultExpensesApprovalUserId ?? "",
        levels: prefilledLevels,
      });
    }
  }, [allApprovalsLevelList, isLoading, reset]);

  // ----------- Handlers for Deletion Modal -------------
  const initiateDelete = (state: DeletionState) => setDeletionState(state);
  const handleConfirmDelete = () => deletionState?.onConfirm();

  // ----------- Submit Handler -------------
  const onSubmit = (values: FormValues) => {
    const allPayloads: any[] = [];
    const originalRecordsMap = Object.values(allApprovalsLevelList || {})
      .flat()
      .reduce((acc: Record<string, any>, rec: any) => {
        acc[rec.id] = rec;
        return acc;
      }, {});

    values.levels.forEach((lvl, lvlIdx) => {
      lvl.expenseTypes.forEach((et) => {
        if (!et.expensesLevelId) {
          allPayloads.push({
            expenseType: et.type,
            level: lvlIdx + 1,
            userId: lvl.user,
            tierkey: et.tier,
            minAmount: Number(et.minAmount),
            maxAmount: Number(et.maxAmount),
          });
        } else {
          const original = originalRecordsMap[et.expensesLevelId];
          const isChanged =
            original.expenseType !== et.type ||
            original.tierkey !== et.tier ||
            Number(original.minAmount) !== Number(et.minAmount) ||
            Number(original.maxAmount) !== Number(et.maxAmount) ||
            String(original.userId) !== String(lvl.user);
          if (isChanged) {
            allPayloads.push({
              expensesLevelId: et.expensesLevelId,
              expenseType: et.type,
              level: lvlIdx + 1,
              userId: lvl.user,
              tierkey: et.tier,
              minAmount: Number(et.minAmount),
              maxAmount: Number(et.maxAmount),
            });
          }
        }
      });
    });

    const createList = allPayloads.filter((p) => !p.expensesLevelId);
    const updateList = allPayloads.filter((p) => p.expensesLevelId);

    // 🆕 Call Create Organisation before anything else
    updateOrganization(
      {
        defaultExpensesApprovalUserId: values.selectedUser,
        defaultExpensesApprovalRoleId: values.defaultApprover,
      },
      {
        onSuccess: () => {
          reset(values); // reset form so isDirty = false after save
        },
      }
    );

    if (createList.length) {
      createApprovalLevel(
        { expenseApprovalLevels: createList },
        { onSuccess: () => reset(values) }
      );
    }
    if (updateList.length) {
      updateApprovalLevel(
        { expenseApprovalLevels: updateList },
        { onSuccess: () => reset(values) }
      );
    }
  };

  // ---- NEW: Show loader while fetching initial data ----
  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Top Selectors*/}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex flex-col gap-2 w-full md:w-64">
              <Label>
                Default First Approver<span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="defaultApprover"
                render={({ field }) => (
                  <SearchableSelect
                    options={rolesOptions as any}
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue("selectedUser", "");
                    }}
                    // onCancelPress={() => field.onChange("")}
                    placeholder="Select department"
                  />
                )}
              />
              <FieldError error={errors.defaultApprover} />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-64">
              <Label>
                Select User<span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="selectedUser"
                render={({ field }) => (
                  <SearchableSelect
                    options={usersOptionsForLevels}
                    value={field.value}
                    onChange={field.onChange}
                    // onCancelPress={() => field.onChange("")}
                    placeholder="Select user"
                    disabled={!roleId}
                  />
                )}
              />
              <FieldError error={errors.selectedUser} />
            </div>
          </div>
          <div className="flex justify-end w-full md:w-auto">
            <Button
              variant="default"
              className="bg-primary text-white"
              type="button"
              onClick={() =>
                addLevel({
                  user: "",
                  expenseTypes: [
                    {
                      type: EXPENSE_TYPE.DAILY,
                      tier: TIER.TIER_1,
                      minAmount: "0",
                      maxAmount: "0",
                    },
                  ],
                })
              }
            >
              + Add New Level
            </Button>
          </div>
        </div>

        {/* --- NEW: Show a message if no levels are present, otherwise map them --- */}
        {levelFields.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/50 p-10 text-center">
            <h3 className="text-lg font-semibold">
              No Approval Levels Configured
            </h3>
            <p className="text-sm text-muted-foreground">
              Get started by clicking the "+ Add New Level" button above.
            </p>
          </Card>
        ) : (
          levelFields.map((level, levelIdx) => (
            <Level
              key={level.id}
              control={control}
              levelIdx={levelIdx}
              removeLevel={removeLevel}
              levelFieldsLength={levelFields.length}
              usersOptions={usersOptionsForExpanseTypes}
              expanseTypeOptions={expanseTypeOptions}
              tierOptions={tierOptions}
              errors={errors}
              watch={watch}
              initiateDelete={initiateDelete}
              deleteApprovalLevel={deleteApprovalLevel}
              isDeleting={isDeleting}
            />
          ))
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-8">
          <Button
            variant="default"
            className="bg-primary text-white flex items-center gap-2"
            type="submit"
            disabled={!isDirty || isProcessing}
          >
            {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
            {isProcessing ? "Processing..." : "Save"}
          </Button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={!!deletionState}
        onOpenChange={(open) => !open && setDeletionState(null)}
        currentRow={{ identifier: deletionState?.itemIdentifierValue || "" }}
        onDelete={handleConfirmDelete}
        itemName={deletionState?.itemName || "item"}
        itemIdentifier="identifier"
      />
    </>
  );
}

// ----------- Level Component -------------
function Level({
  control,
  levelIdx,
  removeLevel,
  levelFieldsLength,
  usersOptions,
  expanseTypeOptions,
  tierOptions,
  errors,
  watch,
  initiateDelete,
  deleteApprovalLevel,
  isDeleting,
}: {
  control: any;
  levelIdx: number;
  removeLevel: (index: number) => void;
  levelFieldsLength: number;
  usersOptions: { label: string; value: string }[];
  expanseTypeOptions: { label: string; value: string }[];
  tierOptions: { label: string; value: string }[];
  errors: any;
  watch: UseFormWatch<FormValues>;
  initiateDelete: (state: DeletionState) => void;
  deleteApprovalLevel: any;
  isDeleting: boolean;
}) {
  const {
    fields: expenseTypeFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `levels.${levelIdx}.expenseTypes` as const,
  });

  const assignedUserIds = (watch("levels") || [])
    .map((l: any) => l.user)
    .filter(Boolean);
  const currentUserId = watch(`levels.${levelIdx}.user`);
  const filteredUsersOptions = usersOptions.filter(
    (u) => !assignedUserIds.includes(u.value) || u.value === currentUserId
  );

  const handleLevelDelete = () => {
    const levelData = watch(`levels.${levelIdx}`);
    const userName =
      usersOptions.find((u) => u.value === levelData.user)?.label ||
      `User in Level ${levelIdx + 1}`;

    initiateDelete({
      itemName: `Level for ${userName}`,
      itemIdentifierValue: `Level ${levelIdx + 1} and all its assigned expense types`,
      onConfirm: () => {
        // Collect existing DB IDs to delete
        const idsToDelete = (levelData.expenseTypes || [])
          .map((et: any) => et.expensesLevelId)
          .filter(Boolean);

        if (idsToDelete.length > 0) {
          // If there are saved items, call API and remove from UI on success
          deleteApprovalLevel(
            { ids: idsToDelete },
            { onSuccess: () => removeLevel(levelIdx) }
          );
        } else {
          // If the level was newly added and never saved, just remove from UI
          removeLevel(levelIdx);
        }
      },
    });
  };

  const handleExpenseTypeDelete = (typeIdx: number) => {
    const expenseTypeData = watch(`levels.${levelIdx}.expenseTypes.${typeIdx}`);

    initiateDelete({
      itemName: "Expense Type",
      itemIdentifierValue: `${formatExpenseType(expenseTypeData.type)} (Tier: ${expenseTypeData.tier}, Amount: ${expenseTypeData.minAmount}-${expenseTypeData.maxAmount})`,
      onConfirm: () => {
        // If it has an ID, it's a saved item
        if (expenseTypeData.expensesLevelId) {
          // Call API and remove from UI on success
          deleteApprovalLevel(
            { ids: [expenseTypeData.expensesLevelId] },
            { onSuccess: () => remove(typeIdx) }
          );
        } else {
          // If no ID, it's a new item, just remove from UI
          remove(typeIdx);
        }
      },
    });
  };

  return (
    <Card className="px-6 py-4 mb-4 gap-4 relative">
      {levelFieldsLength > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 "
          type="button"
          onClick={handleLevelDelete}
          disabled={isDeleting}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      )}
      <div className="font-semibold text-lg">Level {levelIdx + 1}</div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <Label>
            Select User<span className="text-red-500">*</span>
          </Label>
          <Controller
            control={control}
            name={`levels.${levelIdx}.user`}
            render={({ field }) => (
              <SearchableSelect
                options={filteredUsersOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select user"
              />
            )}
          />
          <FieldError error={errors.levels?.[levelIdx]?.user} />
        </div>
      </div>

      {/* Expense Types */}
      {expenseTypeFields.map((et, typeIdx) => (
        <div
          key={et.id}
          className="flex flex-col md:flex-row md:items-end gap-4 mt-4 mb-2"
        >
          <div className="flex-1 flex flex-col gap-2">
            <Label>Expense Type</Label>
            <Controller
              control={control}
              name={`levels.${levelIdx}.expenseTypes.${typeIdx}.type`}
              render={({ field }) => (
                <SearchableSelect
                  options={expanseTypeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select expense type"
                />
              )}
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Label>Tier</Label>
            <Controller
              control={control}
              name={`levels.${levelIdx}.expenseTypes.${typeIdx}.tier`}
              render={({ field }) => (
                <SearchableSelect
                  options={tierOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select tier"
                />
              )}
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Label>Min Amount</Label>
            <Controller
              control={control}
              name={`levels.${levelIdx}.expenseTypes.${typeIdx}.minAmount`}
              render={({ field }) => <Input type="number" {...field} />}
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Label>Max Amount</Label>
            <Controller
              control={control}
              name={`levels.${levelIdx}.expenseTypes.${typeIdx}.maxAmount`}
              render={({ field }) => <Input type="number" {...field} />}
            />
          </div>
          <div className="flex items-center h-10 mt-2 md:mt-0">
            {expenseTypeFields.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => handleExpenseTypeDelete(typeIdx)}
                disabled={isDeleting}
              >
                <Trash2 className="w-5 h-5 " />
              </Button>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
        className="mt-2"
        onClick={() =>
          append({
            type: EXPENSE_TYPE.DAILY,
            tier: TIER.TIER_1,
            minAmount: "0",
            maxAmount: "0",
          })
        }
      >
        + Add Expense Type
      </Button>
    </Card>
  );
}

// ----------- Field Error Component -------------
function FieldError({ error }: { error?: { message?: string } }) {
  if (!error?.message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500">
      <AlertCircle className="h-3 w-3" />
      {error?.message}
    </p>
  );
}
