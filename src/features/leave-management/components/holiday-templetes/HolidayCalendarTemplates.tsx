import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  CalendarDays,
  Plus,
} from "lucide-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MultiSelect from "@/components/ui/MultiSelect";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import { useLeaveStore } from "../../store/use-leave-store";
import { HolidayTemplate, HolidayTemplateSchema } from "../../data/schema";

export default function HolidayCalendarTemplates() {
  const {
    holidayTemplates,
    holidays: masterHolidays,
    addHolidayTemplate,
    deleteHolidayTemplate,
    updateHolidayTemplate,
  } = useLeaveStore();

  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedRow, setSelectedRow] = useState<HolidayTemplate | null>(null);

  const form = useForm<z.infer<typeof HolidayTemplateSchema>>({
    resolver: zodResolver(HolidayTemplateSchema) as any,
    defaultValues: {
      name: "",
      region: "",
      description: "",
      holidayIds: [],
    },
  });

  const handleOpenAdd = () => {
    setSelectedRow(null);
    form.reset({ name: "", region: "", description: "", holidayIds: [] });
    setModalType("add");
  };

  const handleOpenEdit = (template: HolidayTemplate) => {
    setSelectedRow(template);
    form.reset({
      name: template.name,
      region: template.region,
      description: template.description || "",
      holidayIds: template.holidayIds || [],
    });
    setModalType("edit");
  };

  const handleOpenDelete = (template: HolidayTemplate) => {
    setSelectedRow(template);
    setModalType("delete");
  };

  const handleClose = () => {
    setModalType(null);
    setTimeout(() => setSelectedRow(null), 300);
  };

  const onSubmit = (data: z.infer<typeof HolidayTemplateSchema>) => {
    if (modalType === "edit" && selectedRow) {
      updateHolidayTemplate(selectedRow.id, data);
      toast.success("Template updated successfully");
    } else {
      addHolidayTemplate({
        ...data,
        id: crypto.randomUUID(),
      } as HolidayTemplate);
      toast.success("Template created successfully");
    }
    handleClose();
  };

  const onConfirmDelete = () => {
    if (selectedRow) {
      deleteHolidayTemplate(selectedRow.id);
      toast.success("Template deleted successfully");
      handleClose();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Templates
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {holidayTemplates.length} templates
            </div>
            <p className="text-xs text-muted-foreground">
              Active holiday calendars
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">155</div>
            <p className="text-xs text-muted-foreground">
              Using custom calendars
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Holiday Templates
        </h2>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Holiday Template
        </Button>
      </div>

      {/* Templates Grid/List */}
      <div className="space-y-4">
        {holidayTemplates.map((template) => (
          <Card key={template.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="font-normal">
                      <MapPin className="h-3 w-3 mr-1" /> {template.region}
                    </Badge>
                    <Badge variant="secondary" className="font-normal">
                      <CalendarIcon className="h-3 w-3 mr-1" />{" "}
                      {template.holidayIds?.length || 0} holidays
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CustomTooltip title="Edit">
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                      onClick={() => handleOpenEdit(template)}
                    >
                      <IconEdit size={16} />
                    </Button>
                  </CustomTooltip>

                  <CustomTooltip title="Delete">
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleOpenDelete(template)}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </CustomTooltip>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {holidayTemplates.length === 0 && (
          <Card>
            <CardContent className="text-center py-10">
              <div className="text-lg font-semibold">
                No holiday templates yet
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Create a holiday template to group holidays by region.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* 1. Add/Edit Dialog */}
      <Dialog
        open={modalType === "add" || modalType === "edit"}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalType === "edit"
                ? "Edit Holiday Template"
                : "Create Holiday Template"}
            </DialogTitle>
            <DialogDescription>
              Define holidays for specific regions or categories.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Gujarat Region" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Gujarat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {masterHolidays && masterHolidays.length > 0 && (
                <div className="space-y-2">
                  <Label>Choose Holidays</Label>
                  <FormField
                    control={form.control}
                    name="holidayIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelect
                            options={masterHolidays.map((h: any) => ({
                              value: h.id,
                              label: `${h.name} (${format(new Date(h.date), "PPP")})`,
                            }))}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Select holidays"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-xs text-muted-foreground">
                    {form.watch("holidayIds")?.length || 0} holidays selected
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" type="button" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {modalType === "edit" ? "Update Template" : "Save Template"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 2. Delete Modal */}
      {modalType === "delete" && selectedRow && (
        <DeleteModal
          open={modalType === "delete"}
          onOpenChange={(val) => !val && handleClose()}
          currentRow={selectedRow}
          onDelete={onConfirmDelete}
          itemName="Holiday Template"
          itemIdentifier="name"
        />
      )}
    </div>
  );
}
