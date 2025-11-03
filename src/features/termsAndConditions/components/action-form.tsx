import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import CustomButton from "@/components/shared/custom-button";

import { TFormSchemaTerms, formSchemaTerms } from "../data/schema";
import { TERMS_TYPE, TermsAndConditions } from "../types";

interface Props {
  currentRow?: Partial<TermsAndConditions>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  onSubmit: (values: TFormSchemaTerms) => void;
}

export function TermActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: Props) {
  const isEdit = !!currentRow;

  const form = useForm<TFormSchemaTerms>({
    resolver: zodResolver(formSchemaTerms),
    defaultValues: {
      type: currentRow?.type,
      content: currentRow?.content ?? "",
    },
  });

  const { handleSubmit, reset } = form;

  const onSubmit = (values: TFormSchemaTerms) => {
    onSubmitValues(values);
  };

  const handleDialogChange = (state: boolean) => {
    if (!state) reset();
    onOpenChange(state);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[80vh] !max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEdit ? "Edit Document" : "Add New Document"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update document details."
              : "Create a new legal document."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="term-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    Document Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isEdit}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TERMS_TYPE).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    Content <span className="text-red-500">*</span>
                  </Label>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the document content here..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="flex gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <CustomButton type="submit" loading={loading} form="term-form">
            {isEdit ? "Update Document" : "Create Document"}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
