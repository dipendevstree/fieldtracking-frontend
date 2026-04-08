import { Controller, useForm } from "react-hook-form";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomButton from "@/components/shared/custom-button";
import { formSchema, TFormSchema } from "../data/schema";
import { useEffect, useState } from "react";
import { useDirtyTracker } from "@/features/settings/store/use-unsaved-changes-store";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface Props {
  currentRow?: Partial<TFormSchema>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  onSubmit: (values: TFormSchema) => void;
  resetOnSubmitSuccess?: boolean;
}

export function CustomerTypeActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
  resetOnSubmitSuccess,
}: Props) {
  const isEdit = !!currentRow;
  const [showLocalWarning, setShowLocalWarning] = useState(false);

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeName: currentRow?.typeName ?? "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (values: TFormSchema) => {
    onSubmitValues(values);
  };

  useEffect(() => {
    if (!loading && !isEdit && resetOnSubmitSuccess) {
      reset({ typeName: "" });
    }
  }, [loading, isEdit, resetOnSubmitSuccess]);

  const handleDialogChange = (state: boolean) => {
    if (state) {
      return;
    }
    if (form.formState.isDirty) {
      setShowLocalWarning(true);
    } else {
      actualClose();
    }
  };

  const actualClose = () => {
    form.reset();
    onOpenChange(false);
  };

  useDirtyTracker(form.formState.isDirty);

  const { showExitPrompt, confirmExit, cancelExit } = useUnsavedChanges(
    form.formState.isDirty
  );

  const isWarningOpen = showLocalWarning || showExitPrompt;

  const handleCancelDiscard = (isOpen: boolean) => {
    if (!isOpen) {
      setShowLocalWarning(false);
      if (showExitPrompt) cancelExit();
    }
  };

  const handleConfirmDiscard = () => {
    form.reset(form.getValues());
    setShowLocalWarning(false);
    actualClose();

    if (showExitPrompt) {
      setTimeout(() => {
        confirmExit();
      }, 0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[80vh] !max-w-md overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              {isEdit ? "Edit Customer Type" : "Add Customer Type"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              {isEdit
                ? "Update Customer information."
                : "Create a new Customer Type."}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id="customerType-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Customer Type Field */}
            <div className="space-y-2">
              <Label htmlFor="typeName">
                Customer Type <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="typeName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="typeName"
                    placeholder="Enter Customer Type name"
                    value={field.value || ""}
                  />
                )}
              />
              {errors.typeName && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.typeName.message}
                </p>
              )}
            </div>
          </form>
        </Form>

        {/* pop up form button */}

        <DialogFooter className="flex gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <CustomButton
            type="submit"
            loading={loading}
            form="customerType-form"
          >
            {isEdit ? "Update Customer Type" : "Create Customer Type"}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
      <ConfirmDialog
        open={isWarningOpen}
        onOpenChange={handleCancelDiscard}
        title="Unsaved Changes"
        desc="You have unsaved changes. Are you sure you want to discard them? Your changes will be lost."
        confirmText="Discard Changes"
        cancelBtnText="Keep Editing"
        destructive={true}
        handleConfirm={handleConfirmDiscard}
      />
    </Dialog>
  );
}
