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
  useGetExpenseCategoriesDropDownList,
  useGetUsersDropDownList,
  useUpdateApprovalsLevel,
} from "../services/approvers.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { useGetAllTerritoriesForDropdown } from "@/features/userterritory/services/user-territory.hook";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";

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
    })
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
const TIERS = ["Tier 1", "Tier 2"];
const TIER_COLUMN_WIDTH = 240;
const ADD_LEVEL_COLUMN_WIDTH = 300;

// -----------------------------------------------------------------------------
// PRICING FORM
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

  // -------- FORM HOOK --------
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { territory: "", levels: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "levels",
  });

  const selectedTerritory = form.watch("territory");

  // Fetch all approvals data based on selected territory
  const { data: allApprovalsLevelList = {}, isLoading } =
    useGetAllApprovalsLevel();

  const { mutateAsync: createApprovalLevel, isPending: isCreating } =
    useCreateApprovalsLevel();

  const { mutateAsync: updateApprovalLevel, isPending: isUpdating } =
    useUpdateApprovalsLevel();

  const { mutateAsync: deleteApproval, isPending: isDeleting } =
    useDeleteApprovalsLevel();

  const { allTerritories = [] } = useGetAllTerritoriesForDropdown();
  const { expenseCategories: expenseCategoriesData } =
    useGetExpenseCategoriesDropDownList({ defaultCategory: true });

  const categories = useMemo(
    () => (expenseCategoriesData ?? []).map((c: any) => c.categoryName),
    [expenseCategoriesData]
  );

  const { listData: allUsersList = [] } = useGetUsersDropDownList({
    territoryId: selectedTerritory,
  });

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

  // Create original records map for change detection
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
        (cat: any) => cat.expensesCategoryId === categoryId
      );
      return category?.categoryName;
    },
    [expenseCategoriesData]
  );

  // Helper function to find expensesLevelId by data
  const findExpensesLevelId = useCallback(
    (
      userId: string,
      categoryId: string,
      tierKey: string,
      apiData: any,
      territoryId: string | undefined
    ) => {
      const levelData = apiData[userId];
      if (!levelData) return null;

      const item = levelData.find(
        (item: any) =>
          item.expensesCategoryId === categoryId &&
          item.tierkey === tierKey &&
          (territoryId ? item.territoryId === territoryId : !item.territoryId)
      );
      return item?.id || null;
    },
    []
  );

  // -------- Transform API data to form structure --------
  const transformApiDataToForm = useCallback(
    (
      apiData: any,
      categories: string[],
      currentTerritory: string | undefined
    ): FormData => {
      const levelsMap = new Map<number, any>();

      // Filter API data for the current territory
      const filteredApiData: Record<string, any[]> = {};
      Object.entries(apiData).forEach(([userId, levelData]: [string, any]) => {
        filteredApiData[userId] = levelData.filter((item: any) =>
          currentTerritory
            ? item.territoryId === currentTerritory
            : !item.territoryId
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
                  tiers: Array(TIERS.length)
                    .fill(null)
                    .map(() => ({ min: 0, max: 0 })),
                };
              }

              const tierIndex = parseInt(item.tierkey.split("_")[1]) - 1;
              if (tierIndex >= 0 && tierIndex < TIERS.length) {
                currentLevelData.categories[categoryName].tiers[tierIndex] = {
                  min: item.minAmount,
                  max: item.maxAmount,
                };
              }
            }
          });
        }
      );

      // Fill missing categories with default values for each level
      levelsMap.forEach((levelData) => {
        categories.forEach((category) => {
          if (!levelData.categories[category]) {
            levelData.categories[category] = {
              tiers: Array(TIERS.length)
                .fill(null)
                .map(() => ({ min: 0, max: 0 })),
            };
          }
        });
      });

      const sortedLevels = Array.from(levelsMap.values()).sort(
        (a, b) => a.levelNumber - b.levelNumber
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
    [expenseCategoriesData, findCategoryNameById]
  );

  // -------- Populate form from API data when allApprovalsLevelList or territory changes --------
  useEffect(() => {
    if (isLoading || !expenseCategoriesData || categories.length === 0) {
      return;
    }

    // Determine if form population has happened for the current territory
    const currentTerritoryInForm = form.getValues("territory");
    const isInitialLoadOrTerritoryChange =
      !hasPopulatedForm.current || currentTerritoryInForm !== selectedTerritory;

    if (isInitialLoadOrTerritoryChange) {
      const transformedData = transformApiDataToForm(
        allApprovalsLevelList,
        categories,
        selectedTerritory || undefined
      );
      form.reset(transformedData);
      hasPopulatedForm.current = true;
    }
  }, [
    allApprovalsLevelList,
    isLoading,
    categories,
    form,
    selectedTerritory,
    expenseCategoriesData,
    transformApiDataToForm,
  ]);

  // -------- Helper to create new level --------
  const createDefaultLevel = useCallback(
    (
      levelNumber: number,
      categories: string[],
      prevLevels: FormData["levels"],
      availableUsers: { label: string; value: string }[]
    ) => {
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
                tiers: TIERS.map((_, tierIdx) => {
                  if (!prevLevel) {
                    return { min: 0, max: 0 };
                  }
                  const prevMax = Number(prevTiers[tierIdx]?.max ?? 0);
                  return {
                    min: prevMax + 1,
                    max: prevMax + 1,
                  };
                }),
              },
            ];
          })
        ),
      };
    },
    []
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
    [allUsersOptions, selectedUserIds]
  );

  // -------- Add Level (with prefill) --------
  const handleAddLevel = () => {
    if (!categories.length) {
      toast.error("Expense categories not loaded. Cannot add a level.");
      return;
    }
    const prevLevels = form.getValues("levels");
    const availableUsersForNewLevel = getAvailableUsers("");
    append(
      createDefaultLevel(
        fields.length + 1,
        categories,
        prevLevels,
        availableUsersForNewLevel
      )
    );
    form.setValue("levels", form.getValues("levels"), { shouldDirty: true }); // Mark form as dirty
  };

  // -------- ON SUBMIT (Handles Create, Update AND Delete) --------
  const onSubmit = async (data: FormData) => {
    if (!expenseCategoriesData) {
      toast.error("Expense categories not loaded. Cannot save configuration.");
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
      {}
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
            const tierKey = `tier_${tierIndex + 1}`;

            // Find if this combination existed in the original DB data
            const expensesLevelId = findExpensesLevelId(
              level.selectedUser,
              categoryId,
              tierKey,
              allApprovalsLevelList,
              selectedTerritoryId
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
        }
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
      hasPopulatedForm.current = false; // Force re-population from API on next render
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

  //-------- Pre-fill form with first territory if allowed ------------
  useEffect(() => {
    if (
      allTerritories?.length > 0 &&
      allowAddUsersBasedOnTerritories &&
      !form.getValues("territory")
    ) {
      const firstTerritoryId = String(allTerritories[0].id);
      form.setValue("territory", firstTerritoryId);
      hasPopulatedForm.current = false;
    }
  }, [allTerritories, allowAddUsersBasedOnTerritories, form]);

  //--------- styling ------------
  const dynamicGridStyle = {
    gridTemplateColumns: `repeat(${TIERS.length}, minmax(0, 1fr))`,
  };

  const levelColumnWidth = TIERS.length * TIER_COLUMN_WIDTH;
  const levelColumnStyle = {
    minWidth: `${levelColumnWidth}px`,
    maxWidth: `${levelColumnWidth}px`,
  };

  // Show loading state while initial data is being fetched
  if (isLoading && !hasPopulatedForm.current) {
    return <div>Loading configuration...</div>;
  }

  //---------------delete------------
  const initiateDelete = (state: typeof deletionState) =>
    setDeletionState(state);
  const handleConfirmDelete = () => deletionState?.onConfirm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        {/* ---------------------------------- HEADER ---------------------------------- */}
        <div className="border-b bg-card p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Expense Configuration</h1>
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
                            // Reset form to trigger re-population based on new territory
                            // This also marks the form as pristine again
                            hasPopulatedForm.current = false;
                          }}
                          // onCancelPress={() => {
                          //   field.onChange("");
                          //   hasPopulatedForm.current = false;
                          // }}
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
            {/* ---- Top Row ---- */}
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
                      Level {index + 1} {index === 0 && "(Default Approver)"}
                    </div>

                    {/* ---- SEARCHABLE SELECT ---- */}
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

                  {/* TIER HEADERS */}
                  <div className="grid bg-muted/50" style={dynamicGridStyle}>
                    {TIERS.map((t) => (
                      <div
                        key={t}
                        className="p-2 text-center border-r last:border-r-0"
                      >
                        <div className="font-medium text-sm">{t}</div>
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
                    allUsersOptions.length === 0
                  }
                >
                  + Add Level
                </Button>
              </div>
            </div>

            {/* ----------------------- ROWS ----------------------- */}
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
                      {TIERS.map((_, tierIndex) => (
                        <div
                          key={tierIndex}
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
