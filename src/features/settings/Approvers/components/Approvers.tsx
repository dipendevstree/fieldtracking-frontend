import { useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  useFormContext,
  FormProvider,
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

// Helper function to find the max amount for a given type/tier from all previous levels
const findPreviousMaxAmount = (
  allLevels: FormValues["levels"],
  currentLevelIndex: number,
  type: EXPENSE_TYPE,
  tier: TIER
): number | null => {
  // Iterate backwards from the current level
  for (let i = currentLevelIndex - 1; i >= 0; i--) {
    const prevLevel = allLevels[i];
    const matchingExpenseType = prevLevel.expenseTypes.find(
      (et) => et.type === type && et.tier === tier
    );
    if (matchingExpenseType) {
      const maxAmount = Number(matchingExpenseType.maxAmount);
      return isNaN(maxAmount) ? null : maxAmount;
    }
  }
  return null; // No previous level found for this combination
};

// ----------- Main Approvers Component -------------
export default function Approvers() {
  const { data: allApprovalsLevelList = {}, isLoading } =
    useGetAllApprovalsLevel();
  const { user, updateUser } = useAuthStore();
  const onSuccess = (data: any) => {
    updateUser({ organization: data });
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
  const isProcessing = isCreating || isUpdating;
  const [deletionState, setDeletionState] = useState<DeletionState | null>(
    null
  );

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultApprover: user?.organization?.defaultExpensesApprovalRoleId,
      selectedUser: user?.organization?.defaultExpensesApprovalUserId,
      levels: [],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty, dirtyFields, errors },
  } = methods;

  const { allRoles: allRolesList } = useGetAllRolesForDropdownList();
  const roleId = watch("defaultApprover");
  const selectedUserId = watch("selectedUser");
  const { listData: userListDropDownDataforLevel = [] } =
    useGetUsersDropDownList({ roleId, enabled: !!roleId });
  const { listData: userListDropDownForExpenseTypes = [] } =
    useGetUsersDropDownList();

  const {
    fields: levelFields,
    append: addLevel,
    remove: removeLevel,
  } = useFieldArray({ control, name: "levels" });

  // Select options generation
  const userListDropDownListForLevels = userListDropDownDataforLevel?.map(
    (u: any) => ({
      ...u,
      fullName: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
    })
  );
  const userListDropDownListForExpenseTypes =
    userListDropDownForExpenseTypes?.map((u: any) => ({
      ...u,
      fullName: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
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
  }).map((opt) => ({ ...opt, value: String(opt.value) }));
  const assignedUserIdsInLevels = (watch("levels") || [])
    .map((lvl: any) => lvl.user)
    .filter(Boolean);
  const filteredUsersForDefault = usersOptionsForLevels.filter(
    (u) => !assignedUserIdsInLevels.includes(u.value)
  );
  const usersOptionsForExpanseTypes = useSelectOptions<any>({
    listData: userListDropDownListForExpenseTypes,
    labelKey: "fullName",
    valueKey: "id",
  }).map((opt) => ({ ...opt, value: String(opt.value) }));
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
              type: rec.expenseType as EXPENSE_TYPE,
              tier: rec.tierkey as TIER,
              minAmount: String(rec.minAmount),
              maxAmount: String(rec.maxAmount),
            })
          );
          return { user: userId, expenseTypes };
        }
      );
      if (!isDirty) {
        reset({
          defaultApprover:
            user?.organization?.defaultExpensesApprovalRoleId ?? "",
          selectedUser: user?.organization?.defaultExpensesApprovalUserId ?? "",
          levels: prefilledLevels,
        });
      }
    }
  }, [allApprovalsLevelList, isLoading, reset, user]);

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
    values?.levels?.forEach((lvl, lvlIdx) => {
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
    updateOrganization(
      {
        defaultExpensesApprovalUserId: values.selectedUser,
        defaultExpensesApprovalRoleId: values.defaultApprover,
      },
      {
        onSuccess: () => {
          reset(values);
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

  const defaultUserId = watch("selectedUser");

  // 2. Count how many users are available for assignment in levels.
  // We filter out the default approver user.
  const totalAvailableUsersForLevels = usersOptionsForExpanseTypes.filter(
    (u) => u.value !== defaultUserId
  ).length;

  // 3. The button is disabled if the number of levels is equal to or greater
  // than the number of available users.
  const isAddLevelButtonDisabled =
    levelFields.length >= totalAvailableUsersForLevels;

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* 2. Wrap the form with FormProvider */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                      options={filteredUsersForDefault}
                      value={field.value}
                      onChange={field.onChange}
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
                disabled={isAddLevelButtonDisabled}
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
                levelIdx={levelIdx}
                removeLevel={removeLevel}
                levelFieldsLength={levelFields.length}
                usersOptions={usersOptionsForExpanseTypes}
                expanseTypeOptions={expanseTypeOptions}
                tierOptions={tierOptions}
                initiateDelete={initiateDelete}
                deleteApprovalLevel={deleteApprovalLevel}
                isDeleting={isDeleting}
              />
            ))
          )}

          <div className="flex justify-end gap-2 mt-8">
            <Button
              variant="default"
              className="bg-primary text-white flex items-center gap-2"
              type="submit"
              disabled={
                isProcessing ||
                !roleId ||
                !selectedUserId ||
                (!isDirty &&
                  !dirtyFields.defaultApprover &&
                  !dirtyFields.selectedUser)
              }
            >
              {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
              {isProcessing ? "Processing..." : "Save"}
            </Button>
          </div>
        </form>
      </FormProvider>

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
interface LevelProps {
  levelIdx: number;
  removeLevel: (index: number) => void;
  levelFieldsLength: number;
  usersOptions: { label: string; value: string }[];
  expanseTypeOptions: { label: string; value: string }[];
  tierOptions: { label: string; value: string }[];
  initiateDelete: (state: DeletionState) => void;
  deleteApprovalLevel: any;
  isDeleting: boolean;
}

function Level({
  levelIdx,
  removeLevel,
  levelFieldsLength,
  usersOptions,
  expanseTypeOptions,
  tierOptions,
  initiateDelete,
  deleteApprovalLevel,
  isDeleting,
}: LevelProps) {
  // 3. Get all necessary methods from context instead of props
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>();

  const {
    fields: expenseTypeFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `levels.${levelIdx}.expenseTypes` as const,
  });

  const defaultUserId = watch("selectedUser");
  const assignedUserIds = (watch("levels") || [])
    .map((l: any) => l.user)
    .filter(Boolean);
  const currentUserId = watch(`levels.${levelIdx}.user`);
  const filteredUsersOptions = usersOptions.filter(
    (u) =>
      (!assignedUserIds.includes(u.value) || u.value === currentUserId) &&
      u.value !== defaultUserId
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
        const idsToDelete = (levelData.expenseTypes || [])
          .map((et: any) => et.expensesLevelId)
          .filter(Boolean);
        if (idsToDelete.length > 0) {
          deleteApprovalLevel(
            { ids: idsToDelete },
            { onSuccess: () => removeLevel(levelIdx) }
          );
        } else {
          removeLevel(levelIdx);
        }
      },
    });
  };

  const currentExpenseTypes = watch(`levels.${levelIdx}.expenseTypes`) || [];

  // 1. Create a variable to determine if the "Add" button should be disabled.
  const totalPossibleCombinations =
    expanseTypeOptions.length * tierOptions.length;
  const isAddButtonDisabled =
    currentExpenseTypes.length >= totalPossibleCombinations;

  // 2. Create the smart handler for the "Add" button's onClick event.
  const handleSmartAppend = () => {
    // Create a Set of used "Type-Tier" combinations for efficient lookup.
    const usedCombinations = new Set(
      currentExpenseTypes.map((et) => `${et.type}-${et.tier}`)
    );

    // Find the first available combination by iterating through all possibilities.
    let nextCombination: { type: string; tier: string } | null = null;
    for (const typeOption of expanseTypeOptions) {
      for (const tierOption of tierOptions) {
        const combinationKey = `${typeOption.value}-${tierOption.value}`;
        if (!usedCombinations.has(combinationKey)) {
          // We found the first available slot!
          nextCombination = {
            type: typeOption.value,
            tier: tierOption.value,
          };
          break; // Exit the inner loop (tiers)
        }
      }
      if (nextCombination) {
        break; // Exit the outer loop (types)
      }
    }

    // Append the found combination if it exists.
    if (nextCombination) {
      append({
        type: nextCombination.type as EXPENSE_TYPE,
        tier: nextCombination.tier as TIER,
        minAmount: "0", // Will be auto-corrected by useEffect in ExpenseTypeRow
        maxAmount: "0",
      });
    }
  };

  return (
    <Card className="px-6 py-4 mb-4 gap-4 relative">
      {levelFieldsLength > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
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

      {expenseTypeFields.map((et, typeIdx) => (
        <ExpenseTypeRow
          key={et.id}
          levelIdx={levelIdx}
          typeIdx={typeIdx}
          remove={remove}
          canDelete={expenseTypeFields.length > 1}
          expanseTypeOptions={expanseTypeOptions}
          tierOptions={tierOptions}
          isDeleting={isDeleting}
          initiateDelete={initiateDelete}
          deleteApprovalLevel={deleteApprovalLevel}
        />
      ))}

      <Button
        type="button"
        className="mt-2"
        onClick={handleSmartAppend}
        disabled={isAddButtonDisabled}
      >
        + Add Expense Type
      </Button>
    </Card>
  );
}

// ----------- Expense Type Row Component-------------
interface ExpenseTypeRowProps {
  levelIdx: number;
  typeIdx: number;
  remove: (index: number) => void;
  canDelete: boolean;
  expanseTypeOptions: { label: string; value: string }[];
  tierOptions: { label: string; value: string }[];
  isDeleting: boolean;
  initiateDelete: (state: DeletionState) => void;
  deleteApprovalLevel: any;
}

function ExpenseTypeRow({
  levelIdx,
  typeIdx,
  remove,
  canDelete,
  expanseTypeOptions,
  tierOptions,
  isDeleting,
  initiateDelete,
  deleteApprovalLevel,
}: ExpenseTypeRowProps) {
  // 3. Get all necessary methods from context
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
    control,
  } = useFormContext<FormValues>();

  const allLevels = watch("levels");
  const currentType = watch(`levels.${levelIdx}.expenseTypes.${typeIdx}.type`);
  const currentTier = watch(`levels.${levelIdx}.expenseTypes.${typeIdx}.tier`);
  const currentMin = watch(
    `levels.${levelIdx}.expenseTypes.${typeIdx}.minAmount`
  );
  const currentMax = watch(
    `levels.${levelIdx}.expenseTypes.${typeIdx}.maxAmount`
  );

  // This logic remains the same and now correctly uses methods from the context
  useEffect(() => {
    if (!currentType || !currentTier) return;

    allLevels.forEach((lvl, li) => {
      lvl.expenseTypes.forEach((et, ti) => {
        if (et.type === currentType && et.tier === currentTier) {
          trigger(`levels.${li}.expenseTypes.${ti}.minAmount`);
          trigger(`levels.${li}.expenseTypes.${ti}.maxAmount`);
        }
      });
    });
  }, [currentType, currentTier, currentMin, currentMax, allLevels, trigger]);

  useEffect(() => {
    if (currentType && currentTier) {
      const prevMaxAmount = findPreviousMaxAmount(
        allLevels,
        levelIdx,
        currentType,
        currentTier
      );

      if (prevMaxAmount !== null) {
        const suggestedMinAmount = prevMaxAmount + 1;
        const currentMinAmount = Number(
          watch(`levels.${levelIdx}.expenseTypes.${typeIdx}.minAmount`)
        );
        if (isNaN(currentMinAmount) || currentMinAmount <= prevMaxAmount) {
          setValue(
            `levels.${levelIdx}.expenseTypes.${typeIdx}.minAmount`,
            String(suggestedMinAmount),
            { shouldValidate: true }
          );
          setValue(
            `levels.${levelIdx}.expenseTypes.${typeIdx}.maxAmount`,
            String(suggestedMinAmount),
            { shouldValidate: true }
          );
        }
      }
    }
  }, [currentType, currentTier, allLevels, levelIdx, typeIdx, setValue, watch]);

  const handleExpenseTypeDelete = (idx: number) => {
    const expenseTypeData = watch(`levels.${levelIdx}.expenseTypes.${idx}`);
    initiateDelete({
      itemName: "Expense Type",
      itemIdentifierValue: `${formatExpenseType(expenseTypeData.type)} (Tier: ${expenseTypeData.tier})`,
      onConfirm: () => {
        if (expenseTypeData.expensesLevelId) {
          deleteApprovalLevel(
            { ids: [expenseTypeData.expensesLevelId] },
            { onSuccess: () => remove(idx) }
          );
        } else {
          remove(idx);
        }
      },
    });
  };

  const allRowsInLevel = watch(`levels.${levelIdx}.expenseTypes`) || [];

  // 1. Create a map to count how many tiers are used for each expense type.
  const usedTierCounts = new Map<string, number>();
  allRowsInLevel.forEach((row, index) => {
    // We only count rows OTHER than the one we are currently rendering.
    if (index !== typeIdx && row.type) {
      usedTierCounts.set(row.type, (usedTierCounts.get(row.type) || 0) + 1);
    }
  });

  // 2. Filter the master list of expense types.
  const filteredExpanseTypeOptions = expanseTypeOptions.filter((option) => {
    // Always include the currently selected option in the list.
    if (option.value === currentType) {
      return true;
    }
    // Include the option only if the number of times it's been used
    // is less than the total number of available tiers.
    const count = usedTierCounts.get(option.value) || 0;
    return count < tierOptions.length;
  });

  // --- This function for filtering Tiers is still needed and correct ---
  const isSelectedCombo = (type: string, tier: string, currentIdx: number) => {
    return allRowsInLevel.some(
      (et: any, idx: number) =>
        idx !== currentIdx && et.type === type && et.tier === tier
    );
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4 mt-4 mb-2">
      <div className="flex-1 flex flex-col gap-2">
        <Label>Expense Type</Label>
        <Controller
          control={control}
          name={`levels.${levelIdx}.expenseTypes.${typeIdx}.type`}
          render={({ field }) => (
            <SearchableSelect
              options={filteredExpanseTypeOptions}
              {...field}
              placeholder="Select type"
            />
          )}
        />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <Label>Tier</Label>
        <Controller
          control={control}
          name={`levels.${levelIdx}.expenseTypes.${typeIdx}.tier`}
          render={({ field }) => {
            const filteredOptions = tierOptions.filter(
              (opt) => !isSelectedCombo(currentType, opt.value, typeIdx)
            );
            return (
              <SearchableSelect
                options={filteredOptions}
                {...field}
                placeholder="Select tier"
              />
            );
          }}
        />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <Label>Min Amount</Label>
        <Controller
          name={`levels.${levelIdx}.expenseTypes.${typeIdx}.minAmount`}
          render={({ field }) => <Input type="number" {...field} min={0} />}
        />
        <FieldError
          error={errors.levels?.[levelIdx]?.expenseTypes?.[typeIdx]?.minAmount}
        />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <Label>Max Amount</Label>
        <Controller
          name={`levels.${levelIdx}.expenseTypes.${typeIdx}.maxAmount`}
          render={({ field }) => <Input type="number" {...field} min={0} />}
        />
        <FieldError
          error={errors.levels?.[levelIdx]?.expenseTypes?.[typeIdx]?.maxAmount}
        />
      </div>
      <div className="flex items-center h-10 mt-2 md:mt-0">
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => handleExpenseTypeDelete(typeIdx)}
            disabled={isDeleting}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
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
