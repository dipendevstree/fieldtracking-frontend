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
import { TIER } from "@/data/app.data";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  useCreateApprovalsLevel,
  useDeleteApprovalsLevel,
  useGetAllApprovalsLevel,
  useGetAllRolesForDropdownList,
  useGetExpenseCategoriesDropDownList,
  useGetUsersDropDownList,
  useUpdateApprovalsLevel,
  useUpdateOrganization,
} from "../services/approvers.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { formSchema, FormValues } from "../data/approvalLevelSchema";
import { Card } from "@/components/ui/card";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  DeletionState,
  ExpenseCategoryRowProps,
  LevelProps,
} from "../type/type";

// Helper function to find the max amount for a given category/tier from all previous levels
const findPreviousMaxAmount = (
  allLevels: FormValues["levels"],
  currentLevelIndex: number,
  expensesCategoryId: string,
  tier: TIER
): number | null => {
  // Iterate backwards from the current level
  for (let i = currentLevelIndex - 1; i >= 0; i--) {
    const prevLevel = allLevels[i];
    const matchingExpenseCategory = prevLevel.expenseCategories.find(
      (ec) => ec.expensesCategoryId === expensesCategoryId && ec.tier === tier
    );
    if (matchingExpenseCategory) {
      const maxAmount = Number(matchingExpenseCategory.maxAmount);
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

  const { expenseCategories: expenseCategoriesData } =
    useGetExpenseCategoriesDropDownList();
  const expenseCategoriesDropDownList = expenseCategoriesData || [];

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
  const { listData: userListDropDownForExpenseCategories = [] } =
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
  const userListDropDownListForExpenseCategories =
    userListDropDownForExpenseCategories?.map((u: any) => ({
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
    (u) =>
      !assignedUserIdsInLevels.includes(u.value) || u.value === selectedUserId
  );
  const usersOptionsForExpenseCategories = useSelectOptions<any>({
    listData: userListDropDownListForExpenseCategories,
    labelKey: "fullName",
    valueKey: "id",
  }).map((opt) => ({ ...opt, value: String(opt.value) }));
  const tierOptions = Object.entries(TIER).map(([key, value]) => ({
    label: key.replace("TIER_", "Tier "),
    value,
  }));
  const expenseCategoryOptions = useSelectOptions({
    listData: expenseCategoriesDropDownList,
    labelKey: "categoryName",
    valueKey: "expensesCategoryId",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  // Watch for changes in selectedUser and update first level if it exists
  useEffect(() => {
    const levels = watch("levels");
    if (levels.length > 0 && selectedUserId) {
      setValue("levels.0.user", selectedUserId);
    }
  }, [selectedUserId, setValue, watch]);

  // ----------- Prefill Data from API -------------
  useEffect(() => {
    if (
      !isLoading &&
      allApprovalsLevelList &&
      Object.keys(allApprovalsLevelList).length
    ) {
      const prefilledLevels = Object.entries(allApprovalsLevelList).map(
        ([userId, records]) => {
          const expenseCategories = (Array.isArray(records) ? records : []).map(
            (rec) => ({
              expensesLevelId: rec.id,
              expensesCategoryId: rec.expensesCategoryId,
              tier: rec.tierkey as TIER,
              minAmount: String(rec.minAmount),
              maxAmount: String(rec.maxAmount),
            })
          );
          return { user: userId, expenseCategories };
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
      lvl.expenseCategories.forEach((ec) => {
        if (!ec.expensesLevelId) {
          allPayloads.push({
            expensesCategoryId: ec.expensesCategoryId,
            level: lvlIdx + 1,
            userId: lvl.user,
            tierkey: ec.tier,
            minAmount: Number(ec.minAmount),
            maxAmount: Number(ec.maxAmount),
          });
        } else {
          const original = originalRecordsMap[ec.expensesLevelId];
          const isChanged =
            original.expensesCategoryId !== ec.expensesCategoryId ||
            original.tierkey !== ec.tier ||
            Number(original.minAmount) !== Number(ec.minAmount) ||
            Number(original.maxAmount) !== Number(ec.maxAmount) ||
            String(original.userId) !== String(lvl.user);
          if (isChanged) {
            allPayloads.push({
              expensesLevelId: ec.expensesLevelId,

              expensesCategoryId: ec.expensesCategoryId,
              level: lvlIdx + 1,
              userId: lvl.user,
              tierkey: ec.tier,
              minAmount: Number(ec.minAmount),
              maxAmount: Number(ec.maxAmount),
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

  const totalAvailableUsersForLevels = usersOptionsForExpenseCategories.filter(
    (u) => u.value !== defaultUserId
  ).length;

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
                disabled={isAddLevelButtonDisabled || !selectedUserId}
                onClick={() =>
                  addLevel({
                    user: selectedUserId,
                    expenseCategories: [
                      {
                        expensesCategoryId:
                          expenseCategoryOptions?.[0]?.value ?? "", // Use first category as default
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
                usersOptions={usersOptionsForExpenseCategories}
                expenseCategoryOptions={expenseCategoryOptions}
                tierOptions={tierOptions}
                initiateDelete={initiateDelete}
                deleteApprovalLevel={deleteApprovalLevel}
                isDeleting={isDeleting}
                isFirstLevel={levelIdx === 0}
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

function Level({
  levelIdx,
  removeLevel,
  levelFieldsLength,
  usersOptions,
  expenseCategoryOptions,
  tierOptions,
  initiateDelete,
  deleteApprovalLevel,
  isDeleting,
  isFirstLevel,
}: LevelProps) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>();

  const {
    fields: expenseCategoryFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `levels.${levelIdx}.expenseCategories` as const,
  });

  const defaultUserId = watch("selectedUser");
  const assignedUserIds = (watch("levels") || [])
    .map((l: any) => l.user)
    .filter(Boolean);
  const currentUserId = watch(`levels.${levelIdx}.user`);

  const filteredUsersOptions = isFirstLevel
    ? usersOptions
    : usersOptions.filter(
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
      itemIdentifierValue: `Level ${levelIdx + 1} and all its assigned expense categories`,
      onConfirm: () => {
        const idsToDelete = (levelData.expenseCategories || [])
          .map((ec: any) => ec.expensesLevelId)
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

  const currentExpenseCategories =
    watch(`levels.${levelIdx}.expenseCategories`) || [];

  const totalPossibleCombinations =
    expenseCategoryOptions.length * tierOptions.length;
  const isAddButtonDisabled =
    currentExpenseCategories.length >= totalPossibleCombinations;

  const handleSmartAppend = () => {
    const usedCombinations = new Set(
      currentExpenseCategories.map(
        (ec) => `${ec.expensesCategoryId}-${ec.tier}`
      )
    );

    let nextCombination: { categoryId: string; tier: string } | null = null;
    for (const categoryOption of expenseCategoryOptions) {
      for (const tierOption of tierOptions) {
        const combinationKey = `${categoryOption.value}-${tierOption.value}`;
        if (!usedCombinations.has(combinationKey)) {
          nextCombination = {
            categoryId: categoryOption.value,
            tier: tierOption.value,
          };
          break;
        }
      }
      if (nextCombination) {
        break;
      }
    }

    if (nextCombination) {
      append({
        expensesCategoryId: nextCombination.categoryId,
        tier: nextCombination.tier as TIER,
        minAmount: "0",
        maxAmount: "0",
      });
    }
  };

  return (
    <Card className="px-6 py-4 mb-4 gap-4 relative">
      {levelFieldsLength > 1 && !isFirstLevel && (
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
      <div className="font-semibold text-lg">
        Level {levelIdx + 1} {isFirstLevel && "(Default User)"}
      </div>
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
                value={isFirstLevel ? defaultUserId : field.value}
                onChange={field.onChange}
                placeholder="Select user"
                disabled={isFirstLevel}
              />
            )}
          />
          <FieldError error={errors.levels?.[levelIdx]?.user} />
        </div>
      </div>

      {expenseCategoryFields.map((ec, categoryIdx) => (
        <ExpenseCategoryRow
          key={ec.id}
          levelIdx={levelIdx}
          categoryIdx={categoryIdx}
          remove={remove}
          canDelete={expenseCategoryFields.length > 1}
          expenseCategoryOptions={expenseCategoryOptions}
          tierOptions={tierOptions}
          isDeleting={isDeleting}
          initiateDelete={initiateDelete}
          deleteApprovalLevel={deleteApprovalLevel}
        />
      ))}

      <Button
        type="button"
        onClick={handleSmartAppend}
        disabled={isAddButtonDisabled}
      >
        + Add Expense Category
      </Button>
    </Card>
  );
}

// ----------- Expense Category Row Component-------------

function ExpenseCategoryRow({
  levelIdx,
  categoryIdx,
  remove,
  canDelete,
  expenseCategoryOptions,
  tierOptions,
  isDeleting,
  initiateDelete,
  deleteApprovalLevel,
}: ExpenseCategoryRowProps) {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
    control,
  } = useFormContext<FormValues>();

  const allLevels = watch("levels");

  const currentCategoryId = watch(
    `levels.${levelIdx}.expenseCategories.${categoryIdx}.expensesCategoryId`
  );
  const currentTier = watch(
    `levels.${levelIdx}.expenseCategories.${categoryIdx}.tier`
  );
  const currentMin = watch(
    `levels.${levelIdx}.expenseCategories.${categoryIdx}.minAmount`
  );
  const currentMax = watch(
    `levels.${levelIdx}.expenseCategories.${categoryIdx}.maxAmount`
  );

  useEffect(() => {
    if (!currentCategoryId || !currentTier) return;

    allLevels.forEach((lvl, li) => {
      lvl.expenseCategories.forEach((ec, ci) => {
        if (
          ec.expensesCategoryId === currentCategoryId &&
          ec.tier === currentTier
        ) {
          trigger(`levels.${li}.expenseCategories.${ci}.minAmount`);
          trigger(`levels.${li}.expenseCategories.${ci}.maxAmount`);
        }
      });
    });
  }, [
    currentCategoryId,
    currentTier,
    currentMin,
    currentMax,
    allLevels,
    trigger,
  ]);

  useEffect(() => {
    if (currentCategoryId && currentTier) {
      const prevMaxAmount = findPreviousMaxAmount(
        allLevels,
        levelIdx,
        currentCategoryId,
        currentTier
      );

      if (prevMaxAmount !== null) {
        const suggestedMinAmount = prevMaxAmount + 1;
        const currentMinAmount = Number(
          watch(`levels.${levelIdx}.expenseCategories.${categoryIdx}.minAmount`)
        );
        if (isNaN(currentMinAmount) || currentMinAmount <= prevMaxAmount) {
          setValue(
            `levels.${levelIdx}.expenseCategories.${categoryIdx}.minAmount`,
            String(suggestedMinAmount),
            { shouldValidate: true }
          );
          setValue(
            `levels.${levelIdx}.expenseCategories.${categoryIdx}.maxAmount`,
            String(suggestedMinAmount),
            { shouldValidate: true }
          );
        }
      }
    }
  }, [
    currentCategoryId,
    currentTier,
    allLevels,
    levelIdx,
    categoryIdx,
    setValue,
    watch,
  ]);

  const handleExpenseCategoryDelete = (idx: number) => {
    const expenseCategoryData = watch(
      `levels.${levelIdx}.expenseCategories.${idx}`
    );
    const categoryName =
      expenseCategoryOptions.find(
        (opt) => opt.value === expenseCategoryData.expensesCategoryId
      )?.label || expenseCategoryData.expensesCategoryId;
    initiateDelete({
      itemName: "Expense Category",
      itemIdentifierValue: `${categoryName} (Tier: ${expenseCategoryData.tier})`,
      onConfirm: () => {
        if (expenseCategoryData.expensesLevelId) {
          deleteApprovalLevel(
            { ids: [expenseCategoryData.expensesLevelId] },
            { onSuccess: () => remove(idx) }
          );
        } else {
          remove(idx);
        }
      },
    });
  };

  const allRowsInLevel = watch(`levels.${levelIdx}.expenseCategories`) || [];

  const usedTierCounts = new Map<string, number>();
  allRowsInLevel.forEach((row, index) => {
    if (index !== categoryIdx && row.expensesCategoryId) {
      usedTierCounts.set(
        row.expensesCategoryId,
        (usedTierCounts.get(row.expensesCategoryId) || 0) + 1
      );
    }
  });

  const filteredExpenseCategoryOptions = expenseCategoryOptions.filter(
    (option) => {
      if (option.value === currentCategoryId) {
        return true;
      }
      const count = usedTierCounts.get(option.value) || 0;
      return count < tierOptions.length;
    }
  );

  const isSelectedCombo = (
    categoryId: string,
    tier: string,
    currentIdx: number
  ) => {
    return allRowsInLevel.some(
      (ec: any, idx: number) =>
        idx !== currentIdx &&
        ec.expensesCategoryId === categoryId &&
        ec.tier === tier
    );
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-4 mb-2 pr-12">
      <div className="flex-1 flex flex-col md:flex-row md:items-start gap-4">
        {/* Expense Category */}
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <Label>Expense Category</Label>
            <Controller
              control={control}
              name={`levels.${levelIdx}.expenseCategories.${categoryIdx}.expensesCategoryId`}
              render={({ field }) => (
                <SearchableSelect
                  options={filteredExpenseCategoryOptions}
                  {...field}
                  placeholder="Select category"
                />
              )}
            />
          </div>

          <FieldError
            error={
              errors.levels?.[levelIdx]?.expenseCategories?.[categoryIdx]
                ?.expensesCategoryId
            }
          />
        </div>

        {/* Tier */}
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <Label>Tier</Label>
            <Controller
              control={control}
              name={`levels.${levelIdx}.expenseCategories.${categoryIdx}.tier`}
              render={({ field }) => {
                const filteredOptions = tierOptions.filter(
                  (opt) =>
                    !isSelectedCombo(currentCategoryId, opt.value, categoryIdx)
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

          <FieldError
            error={
              errors.levels?.[levelIdx]?.expenseCategories?.[categoryIdx]?.tier
            }
          />
        </div>

        {/* Min Amount */}
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <Label>Min Amount</Label>
            <Controller
              name={`levels.${levelIdx}.expenseCategories.${categoryIdx}.minAmount`}
              render={({ field }) => <Input type="number" {...field} min={0} />}
            />
          </div>

          <FieldError
            error={
              errors.levels?.[levelIdx]?.expenseCategories?.[categoryIdx]
                ?.minAmount
            }
          />
        </div>

        {/* Max Amount */}
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <Label>Max Amount</Label>
            <Controller
              name={`levels.${levelIdx}.expenseCategories.${categoryIdx}.maxAmount`}
              render={({ field }) => <Input type="number" {...field} min={0} />}
            />
          </div>

          <FieldError
            error={
              errors.levels?.[levelIdx]?.expenseCategories?.[categoryIdx]
                ?.maxAmount
            }
          />
        </div>
      </div>

      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => handleExpenseCategoryDelete(categoryIdx)}
          disabled={isDeleting}
          className="absolute top-5 right-0 mt-0"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}

// ----------- Field Error Component -------------
function FieldError({ error }: { error?: { message?: string } }) {
  if (!error?.message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-2">
      <AlertCircle className="h-3 w-3" />
      {error?.message}
    </p>
  );
}
