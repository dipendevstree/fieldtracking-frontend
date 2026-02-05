import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Trash2Icon } from "lucide-react";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  useCreateApprovalsLevel,
  useDeleteApprovalsLevel,
  useGetAllApprovalsLevel,
  useGetAllTiers,
  useGetExpenseCategoriesDropDownList,
  useGetUsersDropDownList,
  useUpdateApprovalsLevel,
} from "../services/approvers.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { useGetAllTerritoriesForDropdown } from "@/features/userterritory/services/user-territory.hook";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { useDirtyTracker } from "../../store/use-unsaved-changes-store";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { ConfirmDialog } from "@/components/confirm-dialog";

// ------------------- ZOD Schema -------------------------
const tierSchema = z
  .object({
    min: z.coerce
      .number({ invalid_type_error: "Min is required" })
      .min(0, "Cannot be negative"),
    max: z.coerce
      .number({ invalid_type_error: "Max is required" })
      .min(0, "Cannot be negative"),
  })
  .refine((data) => data.max >= data.min, {
    message: "Must be equal or higher",
    path: ["max"],
  });

const levelSchema = z.object({
  levelNumber: z.number(),
  selectedUser: z.string().min(1, "Select a user"),
  categories: z.record(
    z.string(),
    z.object({
      tiers: z.array(tierSchema),
    }),
  ),
  // Added for tracking backend ID for easier updates/deletions
  levelId: z.string().optional(),
});

const formSchema = z
  .object({
    territory: z.string().optional(),
    levels: z.array(levelSchema),
  })
  .superRefine((data, ctx) => {
    const levels = data.levels;

    for (let i = 1; i < levels.length; i++) {
      const currentLevel = levels[i];
      const prevLevel = levels[i - 1];

      Object.keys(currentLevel.categories).forEach((catName) => {
        const currentTiers = currentLevel.categories[catName]?.tiers || [];
        const prevTiers = prevLevel.categories[catName]?.tiers || [];

        currentTiers.forEach((tier, tierIndex) => {
          const prevMax = prevTiers[tierIndex]?.max || 0;
          const currentMin = tier.min;

          // Logic: Next level must strictly start AFTER the previous level
          if (currentMin <= prevMax) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Start above ${prevMax}`,
              path: [
                "levels",
                i,
                "categories",
                catName,
                "tiers",
                tierIndex,
                "min",
              ],
            });
          }
        });
      });
    }
  });

type FormData = z.infer<typeof formSchema>;

// -------------------- Constants ---------------------
const TIER_COLUMN_WIDTH = 240;
const ADD_LEVEL_COLUMN_WIDTH = 300;

// -----------------------------------------------------------------------------
// APPROVER FORM
// -----------------------------------------------------------------------------
export function ApproverFormNew() {
  const { user } = useAuthStore();
  const allowAddUsersBasedOnTerritories =
    user?.organization?.allowAddUsersBasedOnTerritories;

  const [deletionState, setDeletionState] = useState<{
    itemName: string;
    itemIdentifierValue: string;
    onConfirm: () => void;
  } | null>(null);

  const { allTerritories = [], isLoading: isTerritoriesLoading } =
    useGetAllTerritoriesForDropdown();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      territory: "",
      levels: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "levels",
  });

  const selectedTerritory = form.watch("territory");

  // API Hooks
  const { data: allApprovalsLevelList = {}, isLoading: isApprovalsLoading } =
    useGetAllApprovalsLevel();

  const { mutateAsync: createApprovalLevel, isPending: isCreating } =
    useCreateApprovalsLevel();
  const { mutateAsync: updateApprovalLevel, isPending: isUpdating } =
    useUpdateApprovalsLevel();
  const { mutateAsync: deleteApproval, isPending: isDeleting } =
    useDeleteApprovalsLevel();

  const {
    expenseCategories: expenseCategoriesData,
    isLoading: isCategoriesLoading,
  } = useGetExpenseCategoriesDropDownList({ defaultCategory: true });

  const { data: allTiersData, isLoading: isTiersLoading } = useGetAllTiers();

  const { listData: allUsersList = [] } = useGetUsersDropDownList({
    territoryId: selectedTerritory,
  });

  // -------- Derived State: Sorted Tiers --------
  const dynamicTiers = useMemo(() => {
    if (!allTiersData || !Array.isArray(allTiersData)) return [];

    return [...allTiersData]
      .sort((a, b) => {
        // Extract number for sorting: "tier_1" -> 1
        const numA = parseInt(a.split("_")[1] || "0");
        const numB = parseInt(b.split("_")[1] || "0");
        return numA - numB;
      })
      .map((key) => {
        // Create label: "tier_1" -> "Tier 1"
        const label = key
          .replace("_", " ")
          .replace(/\b\w/g, (l: any) => l.toUpperCase());
        return { key, label };
      });
  }, [allTiersData]);

  const categories = useMemo(
    () => (expenseCategoriesData ?? []).map((c: any) => c.categoryName),
    [expenseCategoriesData],
  );

  const territoryOptions = useSelectOptions<any>({
    listData: allTerritories ?? [],
    labelKey: "name",
    valueKey: "id",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  const allUsersOptions = useSelectOptions<any>({
    listData: allUsersList
      .filter((u: any) => u.isWebUser)
      .map((u: any) => ({
        ...u,
        fullName: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
      })),
    labelKey: "fullName",
    valueKey: "id",
  }).map((u) => ({ ...u, value: String(u.value) }));

  // Ref to prevent infinite loops on initial form population
  const hasPopulatedForm = useRef(false);

  // Watch for form changes to enable/disable save button
  const isFormDirty = form.formState.isDirty;

  //---------------unsaved changes tracker tab------------
  useDirtyTracker(isFormDirty);

  const { showExitPrompt, confirmExit, cancelExit } = useUnsavedChanges(
    form.formState.isDirty,
  );

  // Calculate strict data readiness
  // This ensures we don't try to transform data until we have columns, rows, and the filter (territory)
  const isDataReady =
    !isApprovalsLoading &&
    !isCategoriesLoading &&
    !isTiersLoading &&
    !isTerritoriesLoading &&
    categories.length > 0 &&
    dynamicTiers.length > 0 &&
    // If territory logic is enabled, we MUST have a selected territory before populating
    (!allowAddUsersBasedOnTerritories || !!selectedTerritory);

  // Sync Default Territory Effect
  // This fixes the issue where data loads late and the form stays on empty territory
  useEffect(() => {
    if (allowAddUsersBasedOnTerritories && allTerritories.length > 0) {
      const currentVal = form.getValues("territory");
      // If no territory selected yet, select the first one
      if (!currentVal) {
        const defaultId = String(allTerritories[0].id);
        form.setValue("territory", defaultId);
        // Reset population flag so the main effect runs again with the correct territory
        hasPopulatedForm.current = false;
      }
    }
  }, [allTerritories, allowAddUsersBasedOnTerritories, form]);

  const originalRecordsMap = useMemo(() => {
    return Object.values(allApprovalsLevelList || {})
      .flat()
      .reduce((acc: Record<string, any>, rec: any) => {
        acc[rec.id] = rec;
        return acc;
      }, {});
  }, [allApprovalsLevelList]);

  // Helper function to find category name by ID
  const findCategoryNameById = useCallback(
    (categoryId: string) => {
      const category = expenseCategoriesData?.find(
        (cat: any) => cat.expensesCategoryId === categoryId,
      );
      return category?.categoryName;
    },
    [expenseCategoriesData],
  );

  // Helper function to find expensesLevelId by data
  const findExpensesLevelId = useCallback(
    (
      userId: string,
      categoryId: string,
      tierKey: string,
      apiData: any,
      territoryId: string | undefined,
    ) => {
      const levelData = apiData[userId];
      if (!levelData) return null;

      const item = levelData.find(
        (item: any) =>
          item.expensesCategoryId === categoryId &&
          item.tierkey === tierKey &&
          (territoryId ? item.territoryId === territoryId : !item.territoryId),
      );
      return item?.id || null;
    },
    [],
  );

  // -------- Transform API data to form structure --------
  const transformApiDataToForm = useCallback(
    (
      apiData: any,
      categories: string[],
      currentTerritory: string | undefined,
      availableTiers: { key: string; label: string }[],
    ): any => {
      const levelsMap = new Map<number, any>();

      // Filter API data for the current territory
      const filteredApiData: Record<string, any[]> = {};
      Object.entries(apiData).forEach(([userId, levelData]: [string, any]) => {
        filteredApiData[userId] = levelData.filter((item: any) =>
          currentTerritory
            ? item.territoryId === currentTerritory
            : !item.territoryId,
        );
      });

      // Group data by level and user
      Object.entries(filteredApiData).forEach(
        ([userId, levelData]: [string, any]) => {
          levelData.forEach((item: any) => {
            const level = item.level;

            if (!levelsMap.has(level)) {
              levelsMap.set(level, {
                levelNumber: level,
                selectedUser: userId,
                categories: {},
                levelId: item.id, // Store a representative ID for the level
              });
            }

            const currentLevelData = levelsMap.get(level);
            const categoryName = findCategoryNameById(item.expensesCategoryId);

            if (categoryName) {
              if (!currentLevelData.categories[categoryName]) {
                currentLevelData.categories[categoryName] = {
                  tiers: Array(availableTiers.length)
                    .fill(null)
                    .map(() => ({ min: "0", max: "0" })),
                };
              }

              // Find the index in our sorted array matching the API tierkey
              const tierIndex = availableTiers.findIndex(
                (t) => t.key === item.tierkey,
              );

              if (tierIndex >= 0) {
                currentLevelData.categories[categoryName].tiers[tierIndex] = {
                  min: String(item.minAmount),
                  max: String(item.maxAmount),
                };
              }
            }
          });
        },
      );

      // Fill missing categories with default values for each level
      levelsMap.forEach((levelData) => {
        categories.forEach((category) => {
          if (!levelData.categories[category]) {
            levelData.categories[category] = {
              tiers: Array(availableTiers.length)
                .fill(null)
                .map(() => ({ min: "0", max: "0" })),
            };
          }
        });
      });

      const sortedLevels = Array.from(levelsMap.values()).sort(
        (a, b) => a.levelNumber - b.levelNumber,
      );

      // Normalize level numbers strictly on load to avoid index gaps immediately
      // This fixes the "1, 2, 4" gap visually on load
      const normalizedLevels = sortedLevels.map((lvl, idx) => ({
        ...lvl,
        levelNumber: idx + 1,
      }));

      return {
        territory: currentTerritory,
        levels: normalizedLevels,
      };
    },
    [expenseCategoriesData, findCategoryNameById],
  );

  // Now strictly relies on isDataReady.
  useEffect(() => {
    // If we are missing categories, tiers, approvals, or territory ID (when required), do nothing yet.
    if (!isDataReady) {
      return;
    }

    const currentTerritoryInForm = form.getValues("territory");
    const isInitialLoadOrTerritoryChange =
      !hasPopulatedForm.current || currentTerritoryInForm !== selectedTerritory;

    if (isInitialLoadOrTerritoryChange) {
      const transformedData = transformApiDataToForm(
        allApprovalsLevelList,
        categories,
        selectedTerritory || undefined,
        dynamicTiers,
      );
      form.reset(transformedData);
      hasPopulatedForm.current = true;
    }
  }, [
    isDataReady,
    allApprovalsLevelList,
    categories,
    form,
    selectedTerritory,
    transformApiDataToForm,
    dynamicTiers,
  ]);

  // -------- Helper to create new level --------
  const createDefaultLevel = useCallback(
    (
      levelNumber: number,
      categories: string[],
      prevLevels: FormData["levels"],
      availableUsers: { label: string; value: string }[],
      availableTiers: { key: string; label: string }[],
    ): any => {
      const defaultUser =
        availableUsers.length > 0 ? availableUsers[0].value : "";
      return {
        levelNumber,
        selectedUser: defaultUser,
        categories: Object.fromEntries(
          categories.map((category) => {
            const prevLevel = prevLevels[levelNumber - 2];
            const prevTiers = prevLevel?.categories?.[category]?.tiers ?? [];

            return [
              category,
              {
                tiers: availableTiers.map((_, tierIdx) => {
                  if (!prevLevel) {
                    return { min: "0", max: "0" };
                  }
                  const prevMax = Number(prevTiers[tierIdx]?.max ?? 0);
                  return {
                    min: String(prevMax + 1),
                    max: String(prevMax + 1),
                  };
                }),
              },
            ];
          }),
        ),
      };
    },
    [],
  );

  // ⭐ All selected userIds from form state
  const selectedUserIds = form.watch("levels").map((lvl) => lvl.selectedUser);

  // ⭐ Filter out already selected users (except current one)
  const getAvailableUsers = useCallback(
    (currentValue: string) => {
      return allUsersOptions.filter((u) => {
        if (u.value === currentValue) return true;
        return !selectedUserIds.includes(u.value);
      });
    },
    [allUsersOptions, selectedUserIds],
  );

  // -------- Add Level --------
  const handleAddLevel = () => {
    if (!categories.length || !dynamicTiers.length) {
      toast.error("Data not loaded. Cannot add a level.");
      return;
    }
    const prevLevels = form.getValues("levels");
    const availableUsersForNewLevel = getAvailableUsers("");
    append(
      createDefaultLevel(
        fields.length + 1,
        categories,
        prevLevels,
        availableUsersForNewLevel,
        dynamicTiers,
      ),
    );
    form.setValue("levels", form.getValues("levels"), { shouldDirty: true });
  };

  // -------- ON SUBMIT (Handles Create, Update AND Delete) --------
  const onSubmit = async (data: FormData) => {
    if (!expenseCategoriesData || !dynamicTiers.length) {
      toast.error("Data not loaded. Cannot save configuration.");
      return;
    }

    const selectedTerritoryId = data.territory || undefined;
    const territoryPayload = selectedTerritoryId
      ? { territoryId: selectedTerritoryId }
      : {};

    const categoryMap = (expenseCategoriesData ?? []).reduce(
      (acc: any, category: any) => {
        acc[category.categoryName] = category.expensesCategoryId;
        return acc;
      },
      {},
    );

    const createList: any[] = [];
    const updateList: any[] = [];
    const existingIdsInForm: Set<string> = new Set();

    // 1. Identify Creates and Updates
    data.levels.forEach((level, index) => {
      // IMPORTANT: We use the index + 1 as the canonical Level Number
      // This fixes the sequence (1, 2, 3...) even if backend was 1, 2, 4
      const currentLevelNumber = index + 1;

      Object.entries(level.categories).forEach(
        ([categoryName, categoryData]) => {
          categoryData.tiers.forEach((tier, tierIndex) => {
            const categoryId = categoryMap[categoryName];

            // Get the correct string key (e.g. "tier_1") from the sorted array
            const tierKey = dynamicTiers[tierIndex]?.key;
            if (!tierKey) return;
            // Find if this combination existed in the original DB data
            const expensesLevelId = findExpensesLevelId(
              level.selectedUser,
              categoryId,
              tierKey,
              allApprovalsLevelList,
              selectedTerritoryId,
            );

            const payload = {
              expensesCategoryId: categoryId,
              level: currentLevelNumber,
              userId: level.selectedUser,
              tierkey: tierKey,
              minAmount: Number(tier.min),
              maxAmount: Number(tier.max),
              ...territoryPayload,
            };

            if (expensesLevelId) {
              // Existing record - Check for changes
              const original = originalRecordsMap[expensesLevelId];
              const isChanged =
                original.expensesCategoryId !== payload.expensesCategoryId ||
                original.tierkey !== payload.tierkey ||
                Number(original.minAmount) !== Number(payload.minAmount) ||
                Number(original.maxAmount) !== Number(payload.maxAmount) ||
                String(original.userId) !== String(payload.userId) ||
                Number(original.level) !== Number(payload.level) || // Checks if level number changed (re-sequencing)
                (selectedTerritoryId &&
                  original.territoryId !== selectedTerritoryId);

              if (isChanged) {
                updateList.push({ ...payload, expensesLevelId });
              }
              existingIdsInForm.add(expensesLevelId);
            } else {
              // New record
              createList.push(payload);
            }
          });
        },
      );
    });

    // 2. Identify Deletions
    // Any ID present in the original DB list for this territory,
    // but NOT present in our processed 'existingIdsInForm', must be deleted.
    const deleteIds: string[] = [];
    Object.values(allApprovalsLevelList || {})
      .flat()
      .forEach((originalItem: any) => {
        const isForCurrentTerritory = selectedTerritoryId
          ? originalItem.territoryId === selectedTerritoryId
          : !originalItem.territoryId;

        if (isForCurrentTerritory && !existingIdsInForm.has(originalItem.id)) {
          deleteIds.push(originalItem.id);
        }
      });

    try {
      // Execute all operations
      if (createList.length > 0) {
        await createApprovalLevel({ expenseApprovalLevels: createList });
      }
      if (updateList.length > 0) {
        await updateApprovalLevel({ expenseApprovalLevels: updateList });
      }
      if (deleteIds.length > 0) {
        await deleteApproval({ ids: deleteIds } as any);
      }

      if (
        createList.length === 0 &&
        updateList.length === 0 &&
        deleteIds.length === 0
      ) {
        toast.info("No changes to save.");
      } else {
        toast.success("Configuration saved successfully.");
      }

      // Reset form state to pristine using the submitted data
      form.reset(data);
      hasPopulatedForm.current = false;
    } catch (error) {
      toast.error("Failed to save configuration. Please try again.");
      console.error("Submission error:", error);
    }
  };

  // -------- SOFT DELETE HANDLER --------
  const handleLevelDelete = (levelIndex: number) => {
    const levelData = form.getValues(`levels.${levelIndex}`);
    const userId = levelData.selectedUser;
    const userName =
      allUsersOptions.find((u) => u.value === userId)?.label ||
      `User in Level ${levelIndex + 1}`;

    initiateDelete({
      itemName: `Level for ${userName}`,
      itemIdentifierValue: `Level ${levelIndex + 1}`,
      onConfirm: async () => {
        // 1. Remove from UI only (No API call here)
        remove(levelIndex);

        // 2. Re-sequence the remaining levels in Form Data
        const currentLevels = form.getValues("levels");
        const resequencedLevels = currentLevels.map((lvl, idx) => ({
          ...lvl,
          levelNumber: idx + 1, // Explicitly set sequential level number
        }));

        // 3. Update Form and Mark Dirty
        form.setValue("levels", resequencedLevels, {
          shouldDirty: true,
          shouldTouch: true,
        });
        setDeletionState(null);
      },
    });
  };

  //--------- styling ------------
  const dynamicGridStyle = {
    gridTemplateColumns: `repeat(${dynamicTiers.length}, minmax(0, 1fr))`,
  };

  const levelColumnWidth = dynamicTiers.length * TIER_COLUMN_WIDTH;
  const levelColumnStyle = {
    minWidth: `${levelColumnWidth}px`,
    maxWidth: `${levelColumnWidth}px`,
  };

  // Use the strict flag. If hasPopulatedForm is true, we allow render (e.g. during background refetch)
  if (!isDataReady && !hasPopulatedForm.current) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading configuration...
      </div>
    );
  }

  //---------------delete------------
  const initiateDelete = (state: typeof deletionState) =>
    setDeletionState(state);
  const handleConfirmDelete = () => deletionState?.onConfirm();

  return (
    <Form {...form}>
      <ConfirmDialog
        open={showExitPrompt}
        onOpenChange={(isOpen) => {
          if (!isOpen) cancelExit();
        }}
        title="Unsaved Changes"
        desc="You have unsaved changes. Are you sure you want to discard them? Your changes will be lost."
        confirmText="Discard Changes"
        cancelBtnText="Keep Editing"
        destructive={true}
        handleConfirm={confirmExit}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        {/* ---------------------------------- HEADER ---------------------------------- */}
        <div className="border-b bg-card p-4 border rounded-lg shadow mb-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                Expense Approvers Configuration
              </h1>
              <p className="text-muted-foreground">
                Configure expense approvers for different expense categories and
                territories.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {allowAddUsersBasedOnTerritories && (
                <div className="w-64">
                  <FormField
                    control={form.control}
                    name="territory"
                    render={({ field }) => (
                      <FormItem>
                        <SearchableSelect
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            hasPopulatedForm.current = false;
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

        {/* ------------------------------- MAIN TABLE -------------------------------- */}
        <div className="overflow-x-auto">
          <div className="border bg-card w-fit relative">
            {/* ... Header Row ... */}
            <div className="flex sticky top-0 bg-card z-40">
              <div className="w-64 p-4 border-r border-b font-semibold text-lg sticky left-0 bg-card z-50">
                Expense Category
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border-r last:border-r-0 border-b"
                  style={levelColumnStyle}
                >
                  <div className="p-4 border-b relative">
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => handleLevelDelete(index)}
                      className="absolute top-2 right-2 h-7 w-7"
                      disabled={isDeleting || isUpdating || isCreating}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>

                    <div className="font-semibold text-lg mb-3">
                      Level {index + 1} {index === 0 && "(Default)"}
                    </div>

                    <div className="max-w-64">
                      <FormField
                        control={form.control}
                        name={`levels.${index}.selectedUser`}
                        render={({ field }) => (
                          <FormItem>
                            <SearchableSelect
                              value={field.value}
                              onChange={(val) => {
                                field.onChange(val ?? "");
                                form.trigger(`levels.${index}.selectedUser`);
                              }}
                              onCancelPress={() => {
                                field.onChange("");
                                form.trigger(`levels.${index}.selectedUser`);
                              }}
                              placeholder="Select User"
                              options={getAvailableUsers(field.value)}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* DYNAMIC TIER HEADERS */}
                  <div className="grid bg-muted/50" style={dynamicGridStyle}>
                    {dynamicTiers.map((t) => (
                      <div
                        key={t.key}
                        className="p-2 text-center border-r last:border-r-0"
                      >
                        <div className="font-medium text-sm">{t.label}</div>
                        <div className="flex justify-evenly text-xs mt-1">
                          <span>Min</span>
                          <span>Max</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* + ADD LEVEL BUTTON */}
              <div
                className="p-4 border-b"
                style={{
                  minWidth: `${ADD_LEVEL_COLUMN_WIDTH}px`,
                  maxWidth: `${ADD_LEVEL_COLUMN_WIDTH}px`,
                }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-full border-2 border-dashed text-lg"
                  onClick={handleAddLevel}
                  disabled={
                    fields.length >= allUsersOptions.length ||
                    allUsersOptions.length === 0 ||
                    dynamicTiers.length === 0
                  }
                >
                  + Add Level
                </Button>
              </div>
            </div>

            {/* ... Data Rows ... */}
            {categories.map((category: string) => (
              <div key={category} className="flex border-b">
                <div className="w-64 p-4 border-r font-medium sticky left-0 bg-card z-20">
                  {category}
                </div>

                {fields.map((field, levelIndex) => (
                  <div
                    key={field.id}
                    style={levelColumnStyle}
                    className="border-r last:border-r-0"
                  >
                    <div className="grid" style={dynamicGridStyle}>
                      {dynamicTiers.map((tierItem, tierIndex) => (
                        <div
                          key={`${tierItem.key}-${tierIndex}`}
                          className="p-2 border-r last:border-r-0"
                        >
                          <div className="flex gap-4 justify-center">
                            <FormField
                              control={form.control}
                              name={`levels.${levelIndex}.categories.${category}.tiers.${tierIndex}.min`}
                              render={({ field }) => (
                                <FormItem>
                                  <Input type="number" {...field} />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`levels.${levelIndex}.categories.${category}.tiers.${tierIndex}.max`}
                              render={({ field }) => (
                                <FormItem>
                                  <Input type="number" {...field} />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* EMPTY COLUMN */}
                <div
                  className="p-4 border-b"
                  style={{
                    minWidth: `${ADD_LEVEL_COLUMN_WIDTH}px`,
                    maxWidth: `${ADD_LEVEL_COLUMN_WIDTH}px`,
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------- FOOTER ------------------------- */}
        <div className="border-t bg-card p-4 flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isCreating || isUpdating || isDeleting || !isFormDirty}
          >
            {isCreating || isUpdating || isDeleting
              ? "Saving..."
              : "Save Configuration"}
          </Button>
        </div>
        <DeleteModal
          open={!!deletionState}
          onOpenChange={(open) => !open && setDeletionState(null)}
          currentRow={{ identifier: deletionState?.itemIdentifierValue || "" }}
          onDelete={handleConfirmDelete}
          itemName={deletionState?.itemName || "item"}
          itemIdentifier="identifier"
        />
      </form>
    </Form>
  );
}
