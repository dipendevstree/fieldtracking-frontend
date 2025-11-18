import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Trash2Icon } from "lucide-react";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useGetExpenseCategoriesDropDownList } from "../../services/approvers.hook";

// ------------------- Schema -------------------------
const tierSchema = z.object({
  min: z.coerce.number().min(0),
  max: z.coerce.number().min(0),
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
const TERRITORIES = ["North", "South", "East", "West"];
const USERS = ["User A", "User B", "User C", "User D"];
const CATEGORIES = [
  "Travel Lumpsum",
  "Food",
  "Accommodation",
  "Stationeries",
  "Parking",
];
const TIERS = ["Tier 1", "Tier 2"];

// Create Level Template
const createDefaultLevel = (levelNumber: number) => ({
  levelNumber,
  selectedUser: "",
  categories: Object.fromEntries(
    CATEGORIES.map((c) => [c, { tiers: TIERS.map(() => ({ min: 0, max: 0 })) }])
  ),
});

const TIER_COLUMN_WIDTH = 240;

// -----------------------------------------------------------------------------
// FINAL PricingForm
// -----------------------------------------------------------------------------
export function PricingForm() {
  const { expenseCategories: expenseCategoriesData } =
    useGetExpenseCategoriesDropDownList({ defaultCategory: true });

    console.log('expenseCategoriesData', expenseCategoriesData);
    
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      territory: "",
      levels: [createDefaultLevel(1)],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "levels",
  });

  const handleAddLevel = () => append(createDefaultLevel(fields.length + 1));

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
                      options={TERRITORIES.map((t) => ({
                        label: t,
                        value: t,
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
                              onChange={field.onChange}
                              onCancelPress={() => field.onChange("")}
                              placeholder="Select User"
                              options={USERS.map((u) => ({
                                label: u,
                                value: u,
                              }))}
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
                >
                  + Add Level
                </Button>
              </div>
            </div>

            {/* ----------------------- ROWS ----------------------- */}
            {CATEGORIES.map((category) => (
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
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`levels.${levelIndex}.categories.${category}.tiers.${tierIndex}.max`}
                              render={({ field }) => (
                                <FormItem>
                                  <Input type="number" {...field} />
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
