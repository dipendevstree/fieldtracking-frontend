import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomButton from "@/components/shared/custom-button";
import {
  expenseLimitFormSchema,
  TExpenseLimitFormSchema,
} from "../data/schema";
import { TIER } from "@/data/app.data";
import { ExpenseCategory } from "../../Expense-categories/type/type";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Props
interface Props {
  currentLimit?: Partial<TExpenseLimitFormSchema>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  expenseCategories?: ExpenseCategory[];
  onSubmit: (values: TExpenseLimitFormSchema) => void;
}

export function ExpenseLimitActionForm({
  currentLimit,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
  expenseCategories = [],
}: Props) {
  const isEdit = !!currentLimit;

  const [limitType, setLimitType] = useState<"daily" | "monthly">("daily");

  // Tier options
  const tiers = Object.values(TIER).map((tierValue) => ({
    label: tierValue.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value: tierValue,
  }));

  const form = useForm<TExpenseLimitFormSchema>({
    resolver: zodResolver(expenseLimitFormSchema),
    defaultValues: {
      tierKey: "",
      expenseCategoryId: "",
      dailyLimit: 0,
      monthlyLimit: 0,
      isActive: true,
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = form;

  // Handle submission
  const onSubmit = (values: TExpenseLimitFormSchema) => {
    try {
      onSubmitValues(values);
      reset({
        tierKey: "",
        expenseCategoryId: "",
        dailyLimit: 0,
        monthlyLimit: 0,
        isActive: true,
      });
      setLimitType("daily"); // reset radio
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  // Reset form when editing or closing
  useEffect(() => {
    if (currentLimit && isEdit) {
      reset({
        tierKey: currentLimit.tierKey || "",
        expenseCategoryId: currentLimit.expenseCategoryId || "",
        dailyLimit: currentLimit.dailyLimit || 0,
        monthlyLimit: currentLimit.monthlyLimit || 0,
        isActive: currentLimit.isActive ?? true,
      });
      // set limit type based on which value exists
      if (currentLimit.dailyLimit && !currentLimit.monthlyLimit)
        setLimitType("daily");
      else if (!currentLimit.dailyLimit && currentLimit.monthlyLimit)
        setLimitType("monthly");
    } else {
      reset({
        tierKey: "",
        expenseCategoryId: "",
        dailyLimit: 0,
        monthlyLimit: 0,
        isActive: true,
      });
      setLimitType("daily");
    }
  }, [currentLimit, isEdit, reset]);

  const handleDialogChange = (state: boolean) => {
    if (!state) {
      reset({
        tierKey: "",
        expenseCategoryId: "",
        dailyLimit: 0,
        monthlyLimit: 0,
        isActive: true,
      });
      setLimitType("daily");
    }
    onOpenChange(state);
  };

  // Reset the other field when switching limit type
  const handleLimitTypeChange = (value: "daily" | "monthly") => {
    setLimitType(value);
    if (value === "daily") {
      reset({ ...getValues(), monthlyLimit: 0 });
    } else {
      reset({ ...getValues(), dailyLimit: 0 });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[80vh] !max-w-md overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              {isEdit ? "Edit Expense Limit" : "Add Expense Limit"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              {isEdit
                ? "Update expense limit for this designation."
                : "Create a new expense limit for a designation."}
            </DialogDescription>
          </div>
          <DialogClose asChild />
        </DialogHeader>

        <Form {...form}>
          <form
            id="expense-limit-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Tier Field */}
            <div className="space-y-2 w-full">
              <Label htmlFor="tierKey">
                Tier <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="tierKey"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiers.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>
                          {tier.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tierKey && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.tierKey.message}
                </p>
              )}
            </div>

            {/* Category Field */}
            <div className="space-y-2 w-full">
              <Label htmlFor="expenseCategoryId">
                Category <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="expenseCategoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    key={`category-select-${open}`}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.length > 0 ? (
                        expenseCategories.map((category: any) => (
                          <SelectItem
                            key={category.expensesCategoryId}
                            value={category.expensesCategoryId}
                          >
                            {category.categoryName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-categories" disabled>
                          No categories available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.expenseCategoryId && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.expenseCategoryId.message}
                </p>
              )}
            </div>

            {/* Limit Type Radio */}
            <div className="space-y-2 w-full">
              <Label className="pb-2">
                Limit Type <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={limitType}
                onValueChange={handleLimitTypeChange}
              >
                <div className="flex gap-4 items-center">
                  <RadioGroupItem value="daily" id="daily-limit-radio" />
                  <Label htmlFor="daily-limit-radio">Daily</Label>

                  <RadioGroupItem value="monthly" id="monthly-limit-radio" />
                  <Label htmlFor="monthly-limit-radio">Monthly</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Conditional Limit Fields */}
            {limitType === "daily" && (
              <div className="space-y-2">
                <Label htmlFor="dailyLimit">
                  Daily Limit <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="dailyLimit"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="dailyLimit"
                      type="number"
                      placeholder="Enter daily limit"
                      value={field.value || ""}
                    />
                  )}
                />
                {errors.dailyLimit && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.dailyLimit.message}
                  </p>
                )}
              </div>
            )}

            {limitType === "monthly" && (
              <div className="space-y-2">
                <Label htmlFor="monthlyLimit">
                  Monthly Limit <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="monthlyLimit"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="monthlyLimit"
                      type="number"
                      placeholder="Enter monthly limit"
                      value={field.value || ""}
                    />
                  )}
                />
                {errors.monthlyLimit && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.monthlyLimit.message}
                  </p>
                )}
              </div>
            )}

            {/* Is Active */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">
                  Active <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter className="flex gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <CustomButton
            type="submit"
            loading={loading}
            form="expense-limit-form"
          >
            {isEdit ? "Update Limit" : "Create Limit"}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
