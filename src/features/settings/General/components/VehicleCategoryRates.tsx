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
import { DeletionState } from "../type/type";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  VehicleCategoryRateForm,
  vehicleCategoryRateSchema,
} from "../data/schema";
import { AlertCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  VehicleCategoryRatesProps,
  VehicleCategoryRateRowProps,
} from "../type/type";
import { Card } from "@/components/ui/card";
import {
  useCreateVehicleCategoryRates,
  useDeleteVehicleCategoryRates,
  useUpdateVehicleCategoryRates,
} from "../services/Generalhook";
import { useAuth } from "@/stores/use-auth-store";
import { usePermissionData } from "@/hooks/use-permission-data";
import { Label } from "@/components/ui/label";

export default function VehicleCategoryRates({
  setSubmitVehicleCategoryForm,
  onDirtyStateChange,
}: VehicleCategoryRatesProps) {
  const { user, updateUser } = useAuth();
  const { mutate: refreshPermissionData } = usePermissionData({
    onSuccess: (data: any) => {
      updateUser({
        ...user,
        ...data,
        role: { ...user?.role, ...data?.role },
        organization: { ...user?.organization, ...data?.organization },
      });
    },
  });

  const { mutate: createVehicleCategoryRates } = useCreateVehicleCategoryRates(
    undefined,
    true,
  );
  const { mutate: updateVehicleCategoryRates } = useUpdateVehicleCategoryRates(
    undefined,
    true,
  );
  const { mutate: deleteVehicleCategoryRates, isPending: isDeleting } =
    useDeleteVehicleCategoryRates(undefined);

  const [deletionState, setDeletionState] = useState<DeletionState | null>(
    null,
  );
  const isInitialized = useRef(false);

  const methods = useForm<VehicleCategoryRateForm>({
    resolver: zodResolver(vehicleCategoryRateSchema),
    defaultValues: {
      vehicleCategoryRateList: [],
    },
  });

  const {
    control,
    reset,
    formState: { isDirty, errors },
  } = methods;

  useEffect(() => {
    if (onDirtyStateChange) {
      onDirtyStateChange(isDirty);
    }
  }, [isDirty, onDirtyStateChange]);

  // We no longer use a fixed master list of categories for selection.
  // The user will enter category names manually via Input fields.

  const {
    fields: vehicleCategoryRateList,
    append: addVehicleCategoryRate,
    remove: removeVehicleCategoryRate,
  } = useFieldArray({ control, name: "vehicleCategoryRateList" });

  // Use the organization's rates from the AuthStore as the source for pre-filling.
  const allVehicleCategoryRows = useMemo(() => {
    const orgRates = (user?.organization as any)?.vehicleCategoryRates || [];

    // Map to the internal form structure
    return orgRates.map((item: any) => ({
      id: item.id || item.id,
      vehicleCategory: item.vehicleCategory,
      ratePerKm: String(item.ratePerKm || 0),
    }));
  }, [user?.organization]);

  // ----------- Prefill Data from API -------------
  useEffect(() => {
    // Only pre-fill once when the data is ready and the form is empty
    if (allVehicleCategoryRows.length > 0 && !isInitialized.current) {
      if (!isDirty && vehicleCategoryRateList.length === 0) {
        reset({
          vehicleCategoryRateList: allVehicleCategoryRows,
        });
        isInitialized.current = true;
      }
    }
  }, [allVehicleCategoryRows, isDirty, reset, vehicleCategoryRateList.length]);

  const onSubmit = useCallback(
    (data: VehicleCategoryRateForm) => {
      const createList = data.vehicleCategoryRateList.filter((p) => !p.id);
      const updateList = data.vehicleCategoryRateList.filter((p) => p.id);

      if (createList.length) {
        createVehicleCategoryRates(createList, {
          onSuccess: () => {
            refreshPermissionData();
            reset(data);
          },
        });
      }
      if (updateList.length) {
        updateVehicleCategoryRates(updateList, {
          onSuccess: () => {
            refreshPermissionData();
            reset(data);
          },
        });
      }
      return true;
    },
    [createVehicleCategoryRates, updateVehicleCategoryRates, reset],
  );

  const validateAndSubmit = useCallback(async () => {
    const isFormValid = await methods.trigger();
    if (!isFormValid) return false;

    const formData = methods.getValues();
    onSubmit(formData);
    return true;
  }, [methods, onSubmit]);

  useEffect(() => {
    setSubmitVehicleCategoryForm(() => validateAndSubmit);
  }, []);

  const initiateDelete = (state: DeletionState) => setDeletionState(state);
  const handleConfirmDelete = () => deletionState?.onConfirm();

  return (
    <>
      <FormProvider {...methods}>
        <form>
          <Card className="px-6 py-8">
            <div className="flex justify-between">
              <label className="text-lg font-semibold">
                Vehicle Category Rates<span className="text-red-500">*</span>
              </label>

              <Button
                variant="default"
                className="bg-primary text-white"
                type="button"
                onClick={() => {
                  addVehicleCategoryRate({
                    vehicleCategory: "",
                    ratePerKm: "0",
                  });
                }}
              >
                + Add New Vehicle Category Rate
              </Button>
            </div>

            {errors.vehicleCategoryRateList &&
              !errors.vehicleCategoryRateList.root && (
                <FieldError error={errors.vehicleCategoryRateList} />
              )}

            {vehicleCategoryRateList.length === 0 ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  No Vehicle Category Rates Configured
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get started by clicking the "+ Add New Vehicle Category Rate"
                  button above.
                </p>
              </div>
            ) : (
              vehicleCategoryRateList.map((level, levelIdx) => (
                <VehicleCategoryRateRow
                  key={level.id}
                  levelIdx={levelIdx}
                  removeVehicleCategoryRate={removeVehicleCategoryRate}
                  initiateDelete={initiateDelete}
                  deleteVehicleCategoryRate={deleteVehicleCategoryRates}
                  isDeleting={isDeleting}
                  canDelete={vehicleCategoryRateList.length > 1}
                  isFirstLevel={levelIdx === 0}
                  refreshPermissionData={refreshPermissionData}
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
const VehicleCategoryRateRow = ({
  levelIdx,
  removeVehicleCategoryRate,
  canDelete,
  isDeleting,
  initiateDelete,
  deleteVehicleCategoryRate,
  refreshPermissionData,
}: VehicleCategoryRateRowProps) => {
  const {
    watch,
    formState: { errors },
    control,
  } = useFormContext<VehicleCategoryRateForm>();

  const handleRowDelete = (idx: number) => {
    const rowData = watch(`vehicleCategoryRateList.${levelIdx}`);
    initiateDelete({
      itemName: "Vehicle Category Rate",
      itemIdentifierValue: `Vehicle Category ( ${rowData.vehicleCategory || "New"} )`,
      onConfirm: () => {
        if (rowData.id) {
          deleteVehicleCategoryRate(
            { ids: [rowData.id] },
            {
              onSuccess: () => {
                refreshPermissionData();
                removeVehicleCategoryRate(idx);
              },
            },
          );
        } else {
          removeVehicleCategoryRate(idx);
        }
      },
    });
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-4 pr-12">
      <div className="flex-1 flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <Label>Vehicle Category</Label>
            <Controller
              control={control}
              name={`vehicleCategoryRateList.${levelIdx}.vehicleCategory`}
              render={({ field }) => (
                <Input {...field} placeholder="Enter category" />
              )}
            />
          </div>
          <FieldError
            error={errors.vehicleCategoryRateList?.[levelIdx]?.vehicleCategory}
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <Label>Rate Per KM</Label>
            <Controller
              name={`vehicleCategoryRateList.${levelIdx}.ratePerKm`}
              render={({ field }) => <Input type="number" {...field} />}
            />
          </div>
          <FieldError
            error={errors.vehicleCategoryRateList?.[levelIdx]?.ratePerKm}
          />
        </div>
      </div>

      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => handleRowDelete(levelIdx)}
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
