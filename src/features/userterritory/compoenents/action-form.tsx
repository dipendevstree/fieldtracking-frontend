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
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useDirtyTracker } from "@/features/settings/store/use-unsaved-changes-store";
import { useState } from "react";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

interface Props {
  currentRow?: Partial<TFormSchema>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  onSubmit: (values: TFormSchema) => void;
}

export function UserTerritoryActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: Props) {
  const isEdit = !!currentRow;
  const [showLocalWarning, setShowLocalWarning] = useState(false);

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentRow?.name ?? "",
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
    reset();
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
      <DialogContent className="max-h-[80vh] max-w-md! overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              {isEdit ? "Edit Territory" : "Add Territory"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              {isEdit
                ? "Update territory information."
                : "Create a new territory."}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

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

        <Form {...form}>
          <form
            id="territory-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Territory Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Territory *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter territory name"
                    value={field.value || ""}
                  />
                )}
              />
              {errors.name && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </p>
              )}
            </div>
          </form>
        </Form>

        <DialogFooter className="flex gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <CustomButton type="submit" loading={loading} form="territory-form">
            {isEdit ? "Update Territory" : "Create Territory"}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
