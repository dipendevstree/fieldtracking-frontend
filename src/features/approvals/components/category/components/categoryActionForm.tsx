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
import { formSchemaCategory, TFormSchema } from "../../../data/schema";

interface Props {
  currentRow?: Partial<TFormSchema>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  onSubmit: (values: TFormSchema) => void;
}

export function CategoryActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: Props) {
  const isEdit = !!currentRow;

  console.log("currentRow", currentRow?.categoryName);

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchemaCategory),

    defaultValues: {
      categoryName: currentRow?.categoryName ?? "",
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
    if (!state) reset();
    onOpenChange(state);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[80vh] !max-w-md overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              {isEdit ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              {isEdit
                ? "Update category information."
                : "Create a new category."}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id="category-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Territory Field */}
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category *</Label>
              <Controller
                name="categoryName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="categoryName"
                    placeholder="Enter category name"
                    value={field.value || ""}
                  />
                )}
              />
              {errors.categoryName && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.categoryName.message}
                </p>
              )}
            </div>
          </form>
        </Form>

        <DialogFooter className="flex gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <CustomButton type="submit" loading={loading} form="category-form">
            {isEdit ? "Update Category" : "Create Category"}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
