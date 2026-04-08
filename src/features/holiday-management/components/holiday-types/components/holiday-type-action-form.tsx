import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props<T> {
  form: any;
  editingId: string | null;
  onSubmit: (data: T) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function HolidayTypeActionForm<T>({
  form,
  editingId,
  onSubmit,
  open,
  onOpenChange,
}: Props<T>) {
  return (
    <Dialog open={!!open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingId ? "Edit Holiday Type" : "Add New Holiday Type"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control as any}
              name="holidayTypeName"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Holiday Type Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., National Holiday" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {editingId ? "Update" : "Save"} Holiday Type
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default HolidayTypeActionForm;
