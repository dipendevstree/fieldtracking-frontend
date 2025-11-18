import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Trash2Icon } from "lucide-react";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  useGetExpenseCategoriesDropDownList,
  useGetUsersDropDownList,
} from "../../services/approvers.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { useGetAllTerritoriesForDropdown } from "@/features/userterritory/services/user-territory.hook";

// ------------------- ZOD Schema -------------------------
// CHANGE: Updated tierSchema with required and max > min validation
const tierSchema = z
  .object({
    min: z.coerce
      .number({ invalid_type_error: "Min is required" })
      .min(0, "Cannot be negative"),
    max: z.coerce
      .number({ invalid_type_error: "Max is required" })
      .min(0, "Cannot be negative"),
  })
  .refine((data) => data.max > data.min, {
    message: "Max must be greater than min",
    path: ["max"], // Point the error to the 'max' field
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
});

const formSchema = z.object({
  territory: z.string().optional(),
  levels: z.array(levelSchema).min(1, "Add at least one level"),
});

type FormData = z.infer<typeof formSchema>;

// -------------------- Constants ---------------------
const TIERS = ["Tier 1", "Tier 2"];

const TIER_COLUMN_WIDTH = 240;

// -----------------------------------------------------------------------------
// PRICING FORM
// -----------------------------------------------------------------------------
export function PricingForm() {
  const { allTerritories = [] } = useGetAllTerritoriesForDropdown();
  const { expenseCategories: expenseCategoriesData } =
    useGetExpenseCategoriesDropDownList({ defaultCategory: true });

  const categories = (expenseCategoriesData ?? []).map(
    (c: any) => c.categoryName
  );

  const { listData: allUsersList = [] } = useGetUsersDropDownList();
  const territoryOptions = useSelectOptions<any>({
    listData: allTerritories ?? [],
    labelKey: "name",
    valueKey: "id",
  });

  // -------- Convert API Users into Select Format --------
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

  // -------- Create Level Template (with prefill logic) --------
  const createDefaultLevel = (
    levelNumber: number,
    categories: string[],
    prevLevels: FormData["levels"]
  ) => {
    return {
      levelNumber,
      selectedUser: "",
      categories: Object.fromEntries(
        categories.map((category) => {
          const prevLevel = prevLevels[levelNumber - 2];
          const prevTiers = prevLevel?.categories?.[category]?.tiers ?? [];

          return [
            category,
            {
              tiers: TIERS.map((_, tierIdx) => {
                // ⭐ Level 1 → always start with 0
                if (!prevLevel) {
                  return { min: 0, max: 0 };
                }

                // ⭐ Level 2+ → base on previous tier max
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
  };

  // -------- FORM HOOK --------
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { territory: "", levels: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "levels",
  });

  // ⭐ All selected userIds from form state
  const selectedUserIds = form.watch("levels").map((lvl) => lvl.selectedUser);

  // ⭐ Filter out already selected users (except current one)
  const getAvailableUsers = (currentValue: string) => {
    return allUsersOptions.filter((u) => {
      if (u.value === currentValue) return true;
      return !selectedUserIds.includes(u.value);
    });
  };

  // -------- Add Level (with prefill) --------
  const handleAddLevel = () => {
    if (!categories.length) return;

    const prevLevels = form.getValues("levels"); // ⭐ current values

    append(createDefaultLevel(fields.length + 1, categories, prevLevels));
  };

  const onSubmit = (data: FormData) => console.log("Form:", data);

  const dynamicGridStyle = {
    gridTemplateColumns: `repeat(${TIERS.length}, minmax(0, 1fr))`,
  };

  const levelColumnWidth = TIERS.length * TIER_COLUMN_WIDTH;
  const levelColumnStyle = {
    minWidth: `${levelColumnWidth}px`,
    maxWidth: `${levelColumnWidth}px`,
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        {/* ---------------------------------- HEADER ---------------------------------- */}
        <div className="border-b bg-card p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Expense Configuration</h1>

            <div className="w-64">
              <FormField
                control={form.control}
                name="territory"
                render={({ field }) => (
                  <FormItem>
                    <SearchableSelect
                      value={field.value}
                      onChange={field.onChange}
                      onCancelPress={() => field.onChange("")}
                      placeholder="Select Territory"
                      options={territoryOptions.map((option) => ({
                        ...option,
                        value: String(option.value),
                      }))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* ------------------------------- MAIN TABLE -------------------------------- */}
        <div className="p-6 overflow-x-auto">
          <div className="border rounded-lg bg-card w-fit relative">
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
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2 h-7 w-7"
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
                              onChange={(val) => field.onChange(val ?? "")}
                              onCancelPress={() => field.onChange("")}
                              placeholder="Select User"
                              options={getAvailableUsers(field.value).map(
                                (u) => ({
                                  label: u.label,
                                  value: u.value,
                                })
                              )}
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
              <div className="p-4 border-b" style={levelColumnStyle}>
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
            {categories.map((category: any) => (
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
                <div style={levelColumnStyle}></div>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------- FOOTER ------------------------- */}
        <div className="border-t bg-card p-4 flex justify-end">
          <Button type="submit" size="lg">
            Save Configuration
          </Button>
        </div>
      </form>
    </Form>
  );
}
