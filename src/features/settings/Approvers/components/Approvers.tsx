import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
} from "../services/approvers.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { formSchema, FormValues } from "../data/approvalLevelSchema";
import { Card } from "@/components/ui/card";

// ----------- Main Approvers Component -------------
export default function Approvers() {
  const { data: allApprovalsLevelList = {}, isLoading } =
    useGetAllApprovalsLevel();

  const { mutate: createApprovalLevel, isPending: isCreating } =
    useCreateApprovalsLevel();
  const { mutate: updateApprovalLevel, isPending: isUpdating } =
    useUpdateApprovalsLevel();
  const { mutate: deleteApprovalLevel, isPending: isDeleting } =
    useDeleteApprovalsLevel();
  const isProcessing = isCreating || isUpdating || isDeleting;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultApprover: "",
      selectedUser: "",
      levels: [
        {
          user: "",
          expenseTypes: [
            {
              type: EXPENSE_TYPE.DAILY,
              tier: TIER.TIER_1,
              minAmount: "0",
              maxAmount: "0",
            },
          ],
        },
      ],
    },
  });

  const { allRoles: allRolesList } = useGetAllRolesForDropdownList();

  const roleId = watch("defaultApprover");

  const { listData: userListDropDownDataforLevel = [] } =
    useGetUsersDropDownList({
      roleId,
      enabled: true,
    });

  const { listData: userListDropDownForExpenseTypes = [] } =
    useGetUsersDropDownList();

  const {
    fields: levelFields,
    append: addLevel,
    remove: removeLevel,
  } = useFieldArray({ control, name: "levels" });

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
    ([key, value]) => ({
      label: formatExpenseType(key),
      value,
    })
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
          return {
            user: userId,
            expenseTypes,
          };
        }
      );

      reset({
        defaultApprover: "",
        selectedUser: "",
        levels: prefilledLevels,
      });
    }
  }, [allApprovalsLevelList, isLoading, reset]);

  // ----------- Submit Handler -------------
  const onSubmit = (values: FormValues) => {
    const allPayloads: any[] = [];
    const deleteIds: string[] = [];

    const originalRecordsMap = Object.values(allApprovalsLevelList || {})
      .flat()
      .reduce((acc: Record<string, any>, rec: any) => {
        acc[rec.id] = rec;
        return acc;
      }, {});

    values.levels.forEach((lvl, lvlIdx) => {
      lvl.expenseTypes.forEach((et) => {
        if (!et.expensesLevelId) {
          // ✅ New record
          allPayloads.push({
            expenseType: et.type,
            level: lvlIdx + 1,
            userId: lvl.user,
            tierkey: et.tier,
            minAmount: Number(et.minAmount),
            maxAmount: Number(et.maxAmount),
          });
        } else {
          // 🛠 Check if it's actually changed
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

    const originalIds = Object.values(allApprovalsLevelList || {})
      .flat()
      .map((rec: any) => rec.id);
    const currentIds = values.levels.flatMap((lvl) =>
      lvl.expenseTypes
        .filter((et) => et.expensesLevelId)
        .map((et) => et.expensesLevelId!)
    );
    deleteIds.push(...originalIds.filter((id) => !currentIds.includes(id)));

    const createList = allPayloads.filter((p) => !p.expensesLevelId);
    const updateList = allPayloads.filter((p) => p.expensesLevelId);

    if (createList.length)
      createApprovalLevel({ expenseApprovalLevels: createList });
    if (updateList.length)
      updateApprovalLevel({ expenseApprovalLevels: updateList });
    if (deleteIds.length) deleteApprovalLevel({ ids: deleteIds });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Top Selectors */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex flex-col gap-2 w-full md:w-64">
            <Label>Default First Approver</Label>
            <Controller
              control={control}
              name="defaultApprover"
              render={({ field }) => (
                <SearchableSelect
                  options={rolesOptions as any}
                  value={field.value}
                  onChange={field.onChange}
                  onCancelPress={() => field.onChange("")}
                  placeholder="Select department"
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-64">
            <Label>Select user</Label>
            <Controller
              control={control}
              name="selectedUser"
              render={({ field }) => (
                <SearchableSelect
                  options={usersOptionsForLevels}
                  value={field.value}
                  onChange={field.onChange}
                  onCancelPress={() => field.onChange("")}
                  placeholder="Select user"
                  disabled={!roleId}
                />
              )}
            />
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

      {/* Levels */}
      {levelFields.map((level, levelIdx) => (
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
        />
      ))}

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-8">
        <Button variant="outline" type="button">
          Cancel
        </Button>
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
}: {
  control: any;
  levelIdx: number;
  removeLevel: (index: number) => void;
  levelFieldsLength: number;
  usersOptions: { label: string; value: string }[];
  expanseTypeOptions: { label: string; value: string }[];
  tierOptions: { label: string; value: string }[];
  errors: any;
}) {
  const {
    fields: expenseTypeFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `levels.${levelIdx}.expenseTypes` as const,
  });

  // Get all assigned users from form state
  const assignedUserIds = (control._formValues?.levels || [])
    .map((l: any) => l.user)
    .filter(Boolean);

  // Current row's user ID
  const currentUserId = control._formValues?.levels?.[levelIdx]?.user;

  // Filter: hide all assigned users except current one
  const filteredUsersOptions = usersOptions.filter(
    (u) => !assignedUserIds.includes(u.value) || u.value === currentUserId
  );

  return (
    <Card className="px-6 mb-4 gap-4 relative">
      {levelFieldsLength > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          type="button"
          onClick={() => removeLevel(levelIdx)}
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
                // onCancelPress={() => field.onChange("")}
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
          className="flex flex-col md:flex-row md:items-end gap-4 mb-2"
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
                  // onCancelPress={() => field.onChange("")}
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
                  // onCancelPress={() => field.onChange("")}
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
                onClick={() => remove(typeIdx)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
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

function FieldError({ error }: { error?: { message?: string } }) {
  if (!error?.message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500">
      <AlertCircle className="h-3 w-3" />
      {error?.message}
    </p>
  );
}
