import { DeleteModal } from "@/components/shared/common-delete-modal";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { DeletionState } from "../../Approvers/type/type";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FixedDayExpenseForm, fixedDayTierExpenseSchema } from "../data/schema";
import { AlertCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  FixedDayExpense,
  FixedDayExpensesProps,
  FixedDayTierExpenseRowProps,
} from "../type/type";
import { TIER } from "@/data/app.data";
import { Card } from "@/components/ui/card";
import {
  useCreateFixedDayExpense,
  useDeleteFixedDayExpense,
  useGetAllFixedDayExpense,
  useUpdateFixedDayExpense,
} from "../services/Generalhook";
import { Label } from "@/components/ui/label";

export default function FixedDayExpenses({
  setSubmitFixedExpenseForm,
  onDirtyStateChange,
}: FixedDayExpensesProps) {
  const { list: allFixedDayExpenseList = {}, isLoading } =
    useGetAllFixedDayExpense();
  const { mutate: createFixedDayExpense } = useCreateFixedDayExpense();
  const { mutate: updateFixedDayExpense } = useUpdateFixedDayExpense();
  const { mutate: deleteFixedDayExpense, isPending: isDeleting } =
    useDeleteFixedDayExpense();

  const [deletionState, setDeletionState] = useState<DeletionState | null>(
    null
  );

  const methods = useForm<FixedDayExpenseForm>({
    resolver: zodResolver(fixedDayTierExpenseSchema),
    defaultValues: {
      fixedDayTierExpenseList: [],
    },
  });

  const {
    control,
    reset,
    formState: { isDirty, errors },
  } = methods;

  useEffect(() => {
    // Notify the parent component whenever the form's dirty state changes
    if (onDirtyStateChange) {
      onDirtyStateChange(isDirty);
    }
  }, [isDirty, onDirtyStateChange]);

  const tierOptions = Object.entries(TIER).map(([key, value]) => ({
    label: key.replace("TIER_", "Tier "),
    value,
  }));

  const {
    fields: fixedDayTierExpense,
    append: addFixedDayTierExpense,
    remove: removeFixedDayTierExpense,
  } = useFieldArray({ control, name: "fixedDayTierExpenseList" });

  // ----------- Prefill Data from API -------------
  useEffect(() => {
    if (
      !isLoading &&
      allFixedDayExpenseList &&
      Object.keys(allFixedDayExpenseList).length
    ) {
      const prefilledLevels = allFixedDayExpenseList.map(
        (records: FixedDayExpense) => {
          if (records) {
            return {
              fixedDayExpenseId: records.id,
              tierKey: records.tierKey,
              dailyExpense: String(records.dailyExpense),
            };
          }
        }
      );
      if (!isDirty) {
        reset({
          fixedDayTierExpenseList: prefilledLevels,
        });
      }
    }
  }, [allFixedDayExpenseList, isLoading, isDirty, reset]);

  const onSubmit = (data: FixedDayExpenseForm) => {
    const createList = data.fixedDayTierExpenseList.filter(
      (p) => !p.fixedDayExpenseId
    );
    const updateList = data.fixedDayTierExpenseList.filter(
      (p) => p.fixedDayExpenseId
    );

    if (createList.length) {
      createFixedDayExpense(createList, { onSuccess: () => reset(data) });
    }
    if (updateList.length) {
      updateFixedDayExpense(updateList, { onSuccess: () => reset(data) });
    }
    return true;
  };

  const validateAndSubmit = useCallback(async () => {
    const isFormValid = await methods.trigger();
    if (!isFormValid) return false;

    const formData = methods.getValues();
    onSubmit(formData);
    return true;
  }, [methods.trigger, methods.getValues, onSubmit]);

  useEffect(() => {
    setSubmitFixedExpenseForm(() => validateAndSubmit);
  }, []);

  const initiateDelete = (state: DeletionState) => setDeletionState(state);
  const handleConfirmDelete = () => deletionState?.onConfirm();

  // ------------- Tier Handling -------------
  const allTierKey = useMemo(
    () => fixedDayTierExpense.map((expense) => expense.tierKey),
    [fixedDayTierExpense]
  );

  const availableTiers = useMemo(
    () =>
      Object.entries(TIER).filter(([_, value]) => !allTierKey.includes(value)),
    [allTierKey]
  );

  return (
    <>
      <FormProvider {...methods}>
        <form>
          <Card className="px-6 py-8">
            <div className="flex justify-between">
              <label className="text-lg font-semibold">
                Fixed Day Expenses<span className="text-red-500">*</span>
              </label>

              <Button
                variant="default"
                className="bg-primary text-white"
                type="button"
                disabled={availableTiers.length === 0} // disable if all tiers used
                title={
                  availableTiers.length === 0
                    ? "All tiers added"
                    : "Add new fixed day expense"
                } // optional tooltip
                onClick={() => {
                  if (availableTiers.length === 0) return; // safety
                  const [_, nextTierValue] = availableTiers[0];
                  addFixedDayTierExpense({
                    tierKey: nextTierValue,
                    dailyExpense: "0",
                  });
                }}
              >
                + Add New Fixed Day Expenses
              </Button>
            </div>

            {errors.fixedDayTierExpenseList &&
              !errors.fixedDayTierExpenseList.root && (
                <FieldError error={errors.fixedDayTierExpenseList} />
              )}

            {fixedDayTierExpense.length === 0 ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  No Fixed Daily Expense Configured
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get started by clicking the "+ Add New Fixed Day Expense"
                  button above.
                </p>
              </div>
            ) : (
              fixedDayTierExpense.map((level, levelIdx) => (
                <FixedDayTierExpenseRow
                  key={level.id}
                  levelIdx={levelIdx}
                  removeFixedDayTierExpense={removeFixedDayTierExpense}
                  tierOptions={tierOptions}
                  initiateDelete={initiateDelete}
                  deleteApprovalLevel={deleteFixedDayExpense}
                  isDeleting={isDeleting}
                  canDelete={fixedDayTierExpense.length > 1}
                  isFirstLevel={levelIdx === 0}
                />
              ))
            )}
          </Card>
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

// ---------------- Row Component ----------------
const FixedDayTierExpenseRow = ({
  levelIdx,
  removeFixedDayTierExpense,
  canDelete,
  tierOptions,
  isDeleting,
  initiateDelete,
  deleteApprovalLevel,
}: FixedDayTierExpenseRowProps) => {
  const {
    watch,
    formState: { errors },
    control,
  } = useFormContext<FixedDayExpenseForm>();
  const allExpenseRowList = watch(`fixedDayTierExpenseList`) || [];

  const checkValue = (tier: string, currentIdx: number) =>
    allExpenseRowList.some(
      (ec: any, idx: number) => idx !== currentIdx && ec.tierKey === tier
    );

  const handleExpenseCategoryDelete = (idx: number) => {
    const expenseCategoryData = watch(`fixedDayTierExpenseList.${levelIdx}`);
    initiateDelete({
      itemName: "Expense Category",
      itemIdentifierValue: `Fixed Day Expense (Tier: ${expenseCategoryData.tierKey})`,
      onConfirm: () => {
        if (expenseCategoryData.fixedDayExpenseId) {
          deleteApprovalLevel(
            { ids: [expenseCategoryData.fixedDayExpenseId] },
            { onSuccess: () => removeFixedDayTierExpense(idx) }
          );
        } else {
          removeFixedDayTierExpense(idx);
        }
      },
    });
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-4 pr-12">
      <div className="flex-1 flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <Label>Tier</Label>
            <Controller
              control={control}
              name={`fixedDayTierExpenseList.${levelIdx}.tierKey`}
              render={({ field }) => {
                const filteredOptions = tierOptions.filter(
                  (opt) =>
                    opt.value === field.value ||
                    !checkValue(opt.value, levelIdx)
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
            error={errors.fixedDayTierExpenseList?.[levelIdx]?.tierKey}
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <Label>Amount</Label>
            <Controller
              name={`fixedDayTierExpenseList.${levelIdx}.dailyExpense`}
              render={({ field }) => <Input type="number" {...field} />}
            />
          </div>
          <FieldError
            error={errors.fixedDayTierExpenseList?.[levelIdx]?.dailyExpense}
          />
        </div>
      </div>

      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => handleExpenseCategoryDelete(levelIdx)}
          disabled={isDeleting}
          className="absolute top-5 right-0 mt-0"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

// ---------------- Field Error ----------------
function FieldError({ error }: { error?: { message?: string } }) {
  if (!error?.message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-2">
      <AlertCircle className="h-3 w-3" />
      {error.message}
    </p>
  );
}
